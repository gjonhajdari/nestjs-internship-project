import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

import { DataSource, EntityManager } from "typeorm";
import { ResourceType } from "../../common/enums/resource-type.enum";
import type { IResponseStatus } from "../../common/interfaces/ResponseStatus.interface";
import { Comment } from "../comments/entities/comment.entity";
import { Room } from "../rooms/entities/room.entity";
import { RoomsService } from "../rooms/rooms.service";
import { User } from "../user/entities/user.entity";
import { catchKnownErrors } from "./../../utils/catchKnownErrors.util";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { ExportNotesDto } from "./dtos/export-notes.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { NoteVote } from "./entities/note-vote.entity";
import { Note } from "./entities/note.entity";
import type { IExportedFile } from "./interfaces/exported-file.interface";
import type {
  IAddVoteNote,
  ICreateNote,
  INoteVote,
  INoteVoteRaw,
  INoteWithAuthor,
  IRemoveVoteNote,
  IUpdateNote,
} from "./interfaces/notes-response.interface";
import type { INotesService } from "./interfaces/notes.service.interface";
import { ParsingProvider } from "./providers/parsing.provider";
import { NotesRepository } from "./repository/notes.repository";
@Injectable()
export class NotesService implements INotesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly notesRepository: NotesRepository,
    private readonly roomsService: RoomsService,
    private readonly parsingProvider: ParsingProvider,
  ) {}

  // /**
  //  * Retrieves all notes within a given viewport (bounding box) in a specific room
  //  * Each note is returned with author information and vote count,
  //  * and only the most recently updated note is returned for each (x, y) coordinate pair
  //  *
  //  * @param roomId - The UUID of the room from which to retrieve notes.
  //  * @param bounds - The spatial bounds (xMin, xMax, yMin, yMax) defining the viewport to filter notes by location
  //  * @returns A promise that resolves to an array of notes (`INoteViewport[]`) within the viewport
  //  *
  //  * @throws {NotFoundException} - Thrown if the specified room does not exist
  //  */
  // public async getNotesInViewport(
  //   roomId: string,
  //   bounds: NotesViewportDto,
  // ): Promise<INoteViewport[]> {
  //   const room = await this.roomsService.findById(roomId);

  //   const subQuery = this.notesRepository
  //     .createQueryBuilder("note")
  //     .leftJoin("note.author", "author")
  //     .select([
  //       "note.uuid AS uuid",
  //       "note.x_axis as xaxis",
  //       "note.y_axis as yaxis",
  //       "ROW_NUMBER() OVER (PARTITION BY note.x_axis, note.y_axis ORDER BY note.updated_at DESC) AS row_num",
  //     ])
  //     .where("note.room_id = :roomId", { roomId: room.id })
  //     .andWhere(
  //       `ST_Intersects(
  //          ST_SetSRID(ST_MakePoint(note.x_axis, note.y_axis), 4326),
  //          ST_MakeEnvelope(:xMin, :yMin, :xMax, :yMax, 4326)
  //        )`,
  //       {
  //         xMin: bounds.xMin,
  //         yMin: bounds.yMin,
  //         xMax: bounds.xMax,
  //         yMax: bounds.yMax,
  //       },
  //     );

  //   const notes = await this.notesRepository
  //     .createQueryBuilder()
  //     .select("DISTINCT sub.*")
  //     .from(`(${subQuery.getQuery()})`, "sub")
  //     .setParameters(subQuery.getParameters())
  //     .where("sub.row_num = 1")
  //     .getRawMany<INoteViewportRaw>();

  //   const result = notes.map((row) => ({
  //     uuid: row.uuid,
  //     xAxis: row.xaxis,
  //     yAxis: row.yaxis,
  //   }));
  //   return result;
  // }

  /**
   * Retrieves a note by its unique UUID, optionally including specified related entities
   *
   * @param noteId - The UUID of the note to retrieve
   * @param relations - An optional array of related entity names to include (e.g., ['author', 'room'])
   * @returns A promise that resolves to the found note entity
   *
   * @throws {NotFoundException} - Thrown if no note is found with the provided UUID
   */
  public async findById(noteId: string, relations?: string[]): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: {
        uuid: noteId,
      },
      relations,
    });

    if (!note) throw new NotFoundException("Note does not exist");

    return note;
  }

  /**
   * Retrieves a note with author information by its unique UUID
   *
   * @param noteId - The UUID of the note to retrieve
   * @returns A promise that resolves to the found note entity with author information
   *
   * @throws {NotFoundException} - Thrown if no note is found with the provided UUID
   */
  public async findNoteByIdWithAuthor(noteId: string): Promise<INoteWithAuthor> {
    const noteWithAuthor = await this.findById(noteId, ["author", "room"]);

    return {
      uuid: noteWithAuthor.uuid,
      content: noteWithAuthor.content,
      color: noteWithAuthor.color,
      totalVotes: noteWithAuthor.totalVotes,
      xAxis: noteWithAuthor.xAxis,
      yAxis: noteWithAuthor.yAxis,
      firstName: noteWithAuthor.author.firstName,
      lastName: noteWithAuthor.author.lastName,
      room: noteWithAuthor.room.uuid,
    };
  }

  /**
   * Retrieves a note by its unique UUID and loads its associated room
   * Applies a pessimistic write lock to prevent concurrent modifications
   *
   * @param noteId - The UUID of the note to retrieve
   * @param manager - The transaction-scoped EntityManager used to access the repository
   * @returns A Promise that resolves to the found note entity with its room relation
   *
   * @throws {EntityNotFoundError} - Thrown by TypeORM if no note is found with the provided UUID
   */
  private async findNoteWithRoomRelation(
    noteId: string,
    manager: EntityManager,
  ): Promise<Note> {
    return await manager
      .getRepository(Note)
      .createQueryBuilder("note")
      .innerJoinAndSelect("note.room", "room")
      .where("note.uuid = :noteId", { noteId })
      .setLock("pessimistic_write")
      .getOneOrFail();
  }

  /**
   * Returns all notes with the highest total votes in a specified room
   * If multiple notes share the highest vote count, all of them are returned
   *
   * @param roomId - Unique room UUID
   * @returns Promise that resolves to an array of objects, each containing
   *          the UUID of a winning note
   *
   * @throws {NotFoundException} - Thrown if no notes with votes greater than zero are found in the specified room
   */

  public async getCurrentNoteVoteWinners(roomId: string): Promise<{ uuid: string }[]> {
    const totalVotesResult = await this.notesRepository
      .createQueryBuilder("note")
      .leftJoin("note.room", "room")
      .where("room.uuid = :roomId", { roomId })
      .andWhere("note.totalVotes > 0")
      .select("MAX(note.totalVotes)", "totalVotes")
      .getRawOne<{ totalVotes: number }>();

    if (!totalVotesResult || !totalVotesResult.totalVotes) {
      return [];
    }

    const winners = await this.notesRepository
      .createQueryBuilder("note")
      .leftJoin("note.room", "room")
      .where("room.uuid = :roomId", { roomId })
      .andWhere("note.totalVotes = :totalVotes", { totalVotes: totalVotesResult.totalVotes })
      .select(["note.uuid AS uuid"])
      .getRawMany<{ uuid: string }>();

    return winners;
  }

  /**
   * Gets an existing vote by a specific user in a specific room.
   * This method is used to check if the user has already voted in the room,
   * which helps enforce the rule that a user can only vote once per room.
   *
   * @param userId - The ID of the user whose vote is being checked.
   * @param roomId - The ID of the room where the vote may exist.
   * @param manager - The EntityManager used to access the transaction-scoped repository.
   * @returns A Promise that resolves to the existing NoteVote entity if found, otherwise null.
   */
  private async findExistingVoteInRoom(
    userId: number,
    roomId: number,
    manager: EntityManager,
  ): Promise<NoteVote | null> {
    const voteRepo = manager.getRepository(NoteVote);

    return await voteRepo.findOne({
      where: {
        user: { id: userId },
        room: { id: roomId },
      },
      relations: ["note"],
    });
  }

  /**
   *  Gets all notes associated with a given room by its UUID
   *
   * @param roomId - Unique room UUID
   * @returns Promise that resolves to an array of Note entities belonging to the specified room.
   * @throws {NotFoundException} - If no room is found with the given UUID
   */
  public async findNotesFromRoom(roomId: string): Promise<Note[]> {
    const room = await this.roomsService.findById(roomId);
    return await this.notesRepository.find({
      where: {
        room: {
          id: room.id,
        },
      },
      relations: ["author"],
      select: {
        author: {
          firstName: true,
          lastName: true,
        },
      },
    });
  }

  /**
   * Creates a new note and saves it in the database
   *
   * @param payload - The data required to create the note (excluding the room relation).
   * @param currentUser - The user creating the note
   * @returns Promise that resolves to the created note
   * @throws {NotFoundException} - If the room with the given UUID does not exist
   * @throws {InternalServerErrorException} - If an error occurs while saving the note to the database
   */
  public async createNote(payload: CreateNoteDto, currentUser: User): Promise<ICreateNote> {
    const room = await this.roomsService.findById(payload.roomId);

    try {
      const { roomId, ...noteData } = payload;
      const newNote = this.notesRepository.create({
        room,
        ...noteData,
        author: currentUser,
      });

      const savedNote = await this.notesRepository.save(newNote);

      const note = {
        uuid: savedNote.uuid,
        content: savedNote.content,
        color: savedNote.color,
        xAxis: savedNote.xAxis,
        yAxis: savedNote.yAxis,
        totalVotes: savedNote.totalVotes,
        firstName: savedNote.author.firstName,
        lastName: savedNote.author.lastName,
        room: savedNote.room.uuid,
      };

      return note;
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while creating the note");
    }
  }

  /**
   * Updates a note in the database with the new given attributes
   *
   * @param noteId - The unique UUID of the note
   * @param payload - The new attributes of the note to update (excluding totalVotes)
   * @returns Promise resolving to the updated note
   * @throws {NotFoundException} - If the note is not found
   * @throws {InternalServerErrorException} - If an error occurs while updating the note to the database
   */
  public async updateNote(
    noteId: string,
    payload: UpdateNoteDto,
    currentUser: User,
  ): Promise<IUpdateNote> {
    const note = await this.findById(noteId);

    const { totalVotes, ...safePayload } = payload as Note;

    try {
      await this.notesRepository.update({ id: note.id }, safePayload);
      const updatedNote = {
        uuid: note.uuid,
        content: note.content,
        color: note.color,
        xAxis: note.xAxis,
        yAxis: note.yAxis,
        totalVotes: note.totalVotes,
      };
      return updatedNote;
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while updating the note");
    }
  }

  /**
   * Soft deletes a note by its UUID, along with associated comments

   * @param noteId - The unique UUID of the note.
   * @returns Promise that resolves to a status object indicating success
   * @throws {NotFoundException} - If the note is not found
   * @throws {ForbiddenException} - If the user is not authorized to delete the note
   * @throws {InternalServerErrorException} - If an error occurs while removing the note.
   */
  public async deleteNote(noteId: string): Promise<IResponseStatus> {
    const note = await this.findById(noteId);

    try {
      await this.dataSource.transaction(async (manager: EntityManager) => {
        const noteRepo = manager.getRepository(Note);
        const commentRepo = manager.getRepository(Comment);
        const voteRepo = manager.getRepository(NoteVote);

        await voteRepo.delete({ note });
        await commentRepo.softDelete({ note });
        await noteRepo.softDelete({ uuid: noteId });
      });

      return {
        success: true,
        resourceType: ResourceType.NOTE,
        resourceId: note.uuid,
        message: "Note deleted successfully",
        timestamp: new Date(),
      };
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while removing the note");
    }
  }

  /**
 * Returns all votes for a given note UUID, including voter user info

 * @param noteId - The unique UUID of the note
 * @returns A Promise that resolves to an array of vote objects,
 *          each containing the voter's UUID, first name, and last name
 * @throws {NotFoundException} - If the note is not found
 * @throws {ForbiddenException} - If the user is not authorized to delete the note
 * @throws {InternalServerErrorException} - If an error occurs while removing the note
 */
  public async findAllNoteVotes(noteId: string): Promise<INoteVote[]> {
    const votes = await this.notesRepository
      .createQueryBuilder("note")
      .leftJoin("note.noteVotes", "vote")
      .leftJoin("vote.user", "user")
      .select([
        "user.uuid AS uuid",
        "user.firstName AS firstname",
        "user.lastName AS lastname",
      ])
      .where("note.uuid = :noteId", { noteId: noteId })
      .andWhere("user.uuid IS NOT NULL")
      .getRawMany<INoteVoteRaw>();

    return votes.map((row) => ({
      uuid: row.uuid,
      firstName: row.firstname,
      lastName: row.lastname,
    }));
  }

  /**
   * Adds a vote to the specified note and increments its total vote count by 1
   * Ensures that a user can only vote once per room. If the user has previously
   * voted for another note in the same room, the vote is switched to the new note,
   * decrementing the previous note's vote count and incrementing the new one
   *
   * @param noteId - The UUID of the note to add a vote to
   * @param currentUser - The user casting the vote
   *
   * @returns A Promise resolving to an object indicating whether the vote was added or switched
   *
   * @throws {NotFoundException} -If the note is not found
   * @throws {BadRequestException} - If the user has already voted for the same note
   * @throws {InternalServerErrorException} - If an error occurs during the vote operation
   */
  public async addVote(noteId: string, currentUser: User): Promise<IAddVoteNote> {
    let switchedFrom: string | null = null;
    let addedTo: string | null = null;

    try {
      await this.dataSource.transaction(async (manager: EntityManager) => {
        const voteRepo = manager.getRepository(NoteVote);
        const noteRepo = manager.getRepository(Note);

        const note = await this.findNoteWithRoomRelation(noteId, manager);

        const existingVote = await this.findExistingVoteInRoom(
          currentUser.id,
          note.room.id,
          manager,
        );

        if (existingVote) {
          if (existingVote.note.id === note.id) {
            throw new BadRequestException("You have already voted for this note!");
          }

          await noteRepo.decrement({ id: existingVote.note.id }, "totalVotes", 1);
          switchedFrom = existingVote.note.uuid;

          existingVote.note = note;
          await voteRepo.save(existingVote);
          await noteRepo.increment({ id: note.id }, "totalVotes", 1);
          addedTo = note.uuid;
        } else {
          const userVote = voteRepo.create({ user: currentUser, note: note, room: note.room });
          await voteRepo.save(userVote);
          await noteRepo.increment({ id: note.id }, "totalVotes", 1);
          addedTo = note.uuid;
        }
      });

      return {
        switchedFrom,
        addedTo,
      };
    } catch (error) {
      catchKnownErrors(error);
      throw new InternalServerErrorException("An error occurred while adding the vote");
    }
  }

  /**
   * Removes a vote from the specified note, decrementing its total vote count by 1
   * Ensures that the user has previously voted in the room before removing the vote
   *
   * @param noteId -The UUID of the note to remove a vote from
   * @param currentUser - The user removing their vote
   *
   * @returns A Promise resolving to an object containing the UUID of the note from which the vote was removed
   *
   * @throws {NotFoundException} - If the note is not found or the user has not voted in the room
   * @throws {BadRequestException} - If the user did not vote for the specified note
   * @throws {InternalServerErrorException} - If an error occurs during the vote removal process
   */
  public async removeVote(noteId: string, currentUser: User): Promise<IRemoveVoteNote> {
    try {
      let removedFrom: string | null = null;

      await this.dataSource.transaction(async (manager: EntityManager) => {
        const voteRepo = manager.getRepository(NoteVote);
        const noteRepo = manager.getRepository(Note);

        const note = await this.findNoteWithRoomRelation(noteId, manager);

        const existingVote = await this.findExistingVoteInRoom(
          currentUser.id,
          note.room.id,
          manager,
        );

        if (!existingVote) throw new NotFoundException("You have not voted in this room!");

        if (existingVote.note.uuid !== note.uuid) {
          throw new BadRequestException("You did not vote for this note!");
        }

        await voteRepo.remove(existingVote);

        if (note.totalVotes > 0) {
          await noteRepo.decrement({ id: existingVote.note.id }, "totalVotes", 1);
        }

        removedFrom = existingVote.note.uuid;
      });

      return {
        removedFrom,
      };
    } catch (error) {
      catchKnownErrors(error);

      throw new InternalServerErrorException(
        "An error occurred while removing the vote from the note",
      );
    }
  }

  /**
   * Exports notes from a specific room in the requested file format.
   *
   * @param query - The export request containing room ID and file type
   * @returns A Promise that resolves to an object that satisfies the IExportedFile interface
   * @throws {UnprocessableEntityException} - If the room has no notes to export
   * @throws {BadRequestException} - If the requested file type is unsupported
   */
  public async exportNotes(query: ExportNotesDto): Promise<IExportedFile> {
    const room = await this.roomsService.findById(query.roomId);
    const notes = await this.findNotesFromRoom(query.roomId);

    if (!notes || notes.length === 0)
      throw new UnprocessableEntityException("Room doesn't have any notes to export");

    return this.exportData(room, notes, query.fileType);
  }

  /**
   * Exports notes data in the specified format based on MIME type.
   *
   * @param room - The room from which notes are being exported
   * @param notes - The notes to be exported
   * @param fileType - The file type that determines the export format
   * @returns An object containing the content as a Buffer, filename, and MIME type
   */
  private exportData(room: Room, notes: Partial<Note>[], fileType: string): IExportedFile {
    let content: string;
    let mime: string;

    switch (fileType) {
      case "json":
        content = this.parsingProvider.parseJson(room, notes);
        mime = "application/json";
        break;
      case "csv":
        content = this.parsingProvider.parseCSV(notes);
        mime = "text/csv";
        break;
      case "xml":
        content = this.parsingProvider.parseXML(room, notes);
        mime = "application/xml";
        break;
      case "pdf":
        content = this.parsingProvider.parsePDF(room, notes);
        mime = "application/pdf";
        break;
      default:
        throw new BadRequestException(`Unsupported file type: ${fileType}`);
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/\..+/, "")
      .replace(/:/g, "-");

    return {
      buffer: Buffer.from(content, fileType === "pdf" ? "base64" : "utf-8"),
      filename: `notes-export-${timestamp}.${fileType}`,
      mimeType: mime,
    };
  }
}
