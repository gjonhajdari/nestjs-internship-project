import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { RoomsService } from "../rooms/rooms.service";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import { INotesService } from "./interfaces/notes.service.interface";
import { NotesRepository } from "./repository/notes.repository";

@Injectable()
export class NotesService implements INotesService {
  constructor(
    private notesRepository: NotesRepository,
    private roomsService: RoomsService,
  ) {}

  /**
   * Gets a note from it's given UUID
   *
   * @param noteId - Unique note UUID
   * @returns Promise that resolves to the found note
   * @throws {NotFoundException} - If no note is found with the given UUID
   */
  async findById(noteId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { uuid: noteId } });

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
    return await this.notesRepository.find({
      where: { room: { uuid: roomId } },
      relations: ["room"],
    });
  }

  /**
   * Creates a new note and saves it in the database
   *
   * @param payload - The required data to create a note
   * @returns Promise that resolves to the created note
   * @throws {NotFoundException} - If no note is found with the given UUID
   * @throws {InternalServerErrorException} - If an error occurs while saving the note to the database
   */
  async createNote(payload: CreateNoteDto): Promise<Note> {
    const room = await this.roomsService.findById(payload.roomId);

    if (!room) {
      throw new NotFoundException("Room does not exist");
    }

    try {
      const { content, xAxis, yAxis } = payload;

      const newNote = this.notesRepository.create({ room, content, xAxis, yAxis });

      return await this.notesRepository.save(newNote);
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while creating the note");
    }
  }

  /**
   * Updates a note in the database with the new given attributes
   *
   * @param noteId - The unique UUID of the note
   * @param payload - Given attributes of the note to update
   * @returns Promise that resolves to the updated note
   * @throws {NotFoundException} - If no note is found with the given UUID
   * @throws {InternalServerErrorException} - If an error occurs while updating the note in the database
   */
  async updateNote(noteId: string, payload: UpdateNoteDto): Promise<Note> {
    const note = await this.findById(noteId);

    try {
      await this.notesRepository.update(note.id, { ...payload });
      return await this.findById(noteId);
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while updating the note");
    }
  }

  /**
   * Deletes a note from the database
   *
   * @param noteId - The unique UUID of the note
   * @throws {NotFoundException} - If no note with the given UUID is found
   * @throws {InternalServerErrorException} - If an error occurs while removing the note
   */
  async deleteNote(noteId: string): Promise<void> {
    const note = await this.findById(noteId);

    try {
      await this.notesRepository.remove(note);
    } catch (error) {
      throw new InternalServerErrorException("An error occurred while removing the note");
    }
  }

  /**
   * Adds a vote to the note, incrementing its vote count by 1
   *
   * @param noteId - The UUID of the note to add a vote to
   * @returns A Promise that resolves to `true` if the vote was successfully added
   * @throws {NotFoundException} - If no note is found with the given UUID
   * @throws {InternalServerErrorException} - If an error occurs while adding the vote
   */
  async addVote(noteId: string): Promise<boolean> {
    const note = await this.findById(noteId);

    try {
      note.totalVotes += 1;
      await this.notesRepository.save(note);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while adding vote to the note",
      );
    }
  }

  /**
   * Removes a vote from the note, decrementing its vote count by 1
   *
   * @param noteId - The UUID of the note to remove a vote from
   * @returns A Promise that resolves to `true` if the vote was successfully removed
   * @throws {NotFoundException} - If no note is found with the given UUID
   * @throws {BadRequestException} - If attempting to remove a vote when the vote count is already 0
   * @throws {InternalServerErrorException} - If an error occurs while removing the vote
   */
  async removeVote(noteId: string): Promise<boolean> {
    const note = await this.findById(noteId);

    if (note.totalVotes === 0) {
      throw new BadRequestException("Cannot remove vote: total votes is already 0");
    }

    try {
      note.totalVotes -= 1;
      await this.notesRepository.save(note);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while removing vote from the note",
      );
    }
  }
}
