import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { DataSource } from "typeorm";
import { IDeleteStatus } from "../../common/interfaces/DeleteStatus.interface";
import { RoomsService } from "../rooms/rooms.service";
import { User } from "../user/entities/user.entity";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import { INotesService } from "./interfaces/notes.service.interface";
import { NoteVoteRepository } from "./repository/note-vote.repository";
import { NotesRepository } from "./repository/notes.repository";

@Injectable()
export class NotesService implements INotesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly noteVoteRepository: NoteVoteRepository,
    private readonly notesRepository: NotesRepository,
    private readonly roomsService: RoomsService,
  ) {}

  /**
   * Gets a note from it's given UUID
   *
   * @param noteId - Unique note UUID
   * @returns Promise that resolves to the found note
   * @throws {NotFoundException} - If no note is found with the given UUID
   */
  async findById(noteId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { uuid: noteId },
      relations: ["room", "author"],
    });

    if (!note) throw new NotFoundException("Note does not exist");

    return note;
  }

  /**
   * Gets all notes in a given room
   *
   * @param roomId - Unique room UUID
   * @returns Promise that resolves to the found notes array
   * @throws {NotFoundException} - If no room is found with the given UUID
   */
  async findNotesFromRoom(roomId: string): Promise<Note[]> {
    const room = await this.roomsService.findById(roomId);

    return await this.notesRepository.find({
      where: { room: { id: room.id } },
      relations: ["author", "comments"],
    });
  }

  /**
   * Creates a new note and saves it in the database
   *
   * @param payload - The required data to create a note
   * @param currentUser - The user creating the note
   * @returns Promise that resolves to the created note
   * @throws {NotFoundException} - If the room with the given UUID does not exist
   * @throws {InternalServerErrorException} - If an error occurs while saving the note to the database
   */
  async createNote(payload: CreateNoteDto, currentUser: User): Promise<Note> {
    const room = await this.roomsService.findById(payload.roomId);

    try {
      const newNote = this.notesRepository.create({ room, ...payload, author: currentUser });

      return await this.notesRepository.save(newNote);
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while creating the note");
    }
  }

  /**
   * Updates a note in the database with the new given attributes.
   * Only the author of the note is allowed to perform the update.
   *
   * @param noteId - The unique UUID of the note.
   * @param payload - The new attributes of the note to update.
   * @param currentUser - The user attempting to update the note.
   * @returns Promise that resolves to the updated note.
   * @throws {NotFoundException} - If no note is found with the given UUID.
   * @throws {ForbiddenException} - If the current user is not the author of the note.
   * @throws {InternalServerErrorException} - If an error occurs while updating the note in the database.
   */
  async updateNote(noteId: string, payload: UpdateNoteDto, currentUser: User): Promise<Note> {
    const note = await this.findById(noteId);

    if (note.author?.id !== currentUser?.id) {
      throw new ForbiddenException("You are not allowed to update this note");
    }

    try {
      await this.notesRepository.update(note.id, { ...payload });
      return await this.findById(noteId);
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while updating the note");
    }
  }

  /**
   * Deletes a note from the database.
   * This operation is restricted to either:
   * - The author of the note, or
   * - A user with the "host" role in the same room as the note.
   *
   * Authorization is handled via the DeleteNoteGuard.
   *
   * @param noteId - The unique UUID of the note.
   * @returns Promise that resolves to a status object indicating success
   * @throws {NotFoundException} - If no note with the given UUID is found.
   * @throws {ForbiddenException} - If the user is not authorized to delete the note
   * @throws {InternalServerErrorException} - If an error occurs while removing the note.
   */
  async deleteNote(noteId: string): Promise<IDeleteStatus> {
    const note = await this.findById(noteId);

    try {
      await this.notesRepository.remove(note);

      return {
        success: true,
        resourceType: "note",
        resourceId: note.uuid,
        message: "Note deleted successfully",
        timestamp: new Date(),
      };
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while removing the note");
    }
  }

  /**
   * Adds a vote to the specified note and increments its vote count by 1.
   * A user can only vote once per room, regardless of how many notes are in it.
   *
   * @param noteId - The UUID of the note to add a vote to
   * @param currentUser - The user casting the vote
   * @returns A Promise that resolves to true if the vote was successfully added
   * @throws {NotFoundException} - If the note with the given UUID is not found
   * @throws {BadRequestException} - If missing user or room information & if the user has already voted in the same room
   * @throws {InternalServerErrorException} - If an error occurs while saving the vote or updating the note
   */
  async addVote(noteId: string, currentUser: User): Promise<boolean> {
    const note = await this.findById(noteId);

    if (!currentUser?.id || !note.room?.id) {
      throw new BadRequestException("Missing user or room information");
    }

    const existingVote = await this.noteVoteRepository.findOne({
      where: {
        user: { id: currentUser.id },
        room: { id: note.room.id },
      },
    });

    if (existingVote) {
      throw new BadRequestException("You have already voted in this room.");
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        const voteRepo = manager.withRepository(this.noteVoteRepository);
        const notesRepo = manager.withRepository(this.notesRepository);

        const userVote = voteRepo.create({
          user: currentUser,
          note,
          room: note.room,
        });

        await voteRepo.save(userVote);

        note.totalVotes += 1;
        await notesRepo.save(note);
      });

      return true;
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while adding the vote");
    }
  }

  /**
   * Removes a vote from the note, decrementing its vote count by 1.
   *
   * @param noteId - The UUID of the note to remove a vote from
   * @param currentUser - The user removing the vote
   * @returns A Promise that resolves to true if the vote was successfully removed
   * @throws {NotFoundException} - If the note is not found or if the user has not voted in the room
   * @throws {BadRequestException} - If missing user or room information
   * @throws {InternalServerErrorException} - If an error occurs while removing the vote
   */
  async removeVote(noteId: string, currentUser: User): Promise<boolean> {
    const note = await this.findById(noteId);

    if (!currentUser?.id || !note.room?.id) {
      throw new BadRequestException("Missing user or room information");
    }

    const existingVote = await this.noteVoteRepository.findOne({
      where: {
        user: { id: currentUser.id },
        room: { id: note.room.id },
      },
    });

    if (!existingVote) {
      throw new NotFoundException("You have not voted in this room");
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        const voteRepo = manager.withRepository(this.noteVoteRepository);
        const notesRepo = manager.withRepository(this.notesRepository);

        await voteRepo.remove(existingVote);

        if (note.totalVotes > 0) {
          note.totalVotes -= 1;
          await notesRepo.save(note);
        }
      });

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while removing the vote from the note",
      );
    }
  }
}
