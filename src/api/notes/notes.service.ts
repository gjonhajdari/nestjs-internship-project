import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import { INotesService } from "./interfaces/notes.service.interface";
import { NotesRepository } from "./repository/notes.repository";

@Injectable()
export class NotesService implements INotesService {
  constructor(private notesRepository: NotesRepository) {}

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
  async findAll(roomId: string): Promise<Note[]> {
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
   */
  async create(payload: CreateNoteDto): Promise<Note> {
    throw new Error("Method not implemented.");
  }

  /**
   * Updates a note in the database with the new given attributes
   *
   * @param noteId - The unique UUID of the note
   * @param payload - Given attributes of the note to update
   * @returns Promise that resolves to the updated note
   * @throws {NotFoundException} - If no note is found with the given UUID
   */
  async updateNote(noteId: string, payload: UpdateNoteDto): Promise<Note> {
    throw new Error("Method not implemented.");
  }

  /**
   * Deletes a note from the database
   *
   * @param noteId - The unique UUID of the note
   * @throws {NotFoundException} - If no note with the given UUID is found
   */
  async deleteNote(noteId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * Adds a new vote to the note and increments the vote count by 1
   *
   * @param noteId - The unique UUID of the note
   * @throws {NotFoundException} - If no note with the given UUID is found
   */
  async addVote(noteId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  /**
   * Removes a vote from the note and decrements the vote count by 1
   *
   * @param noteId - The unique UUID of the note
   * @throws {NotFoundException} - If no note with the given UUID is found
   * @throws {BadRequestException} - If trying to decrement while vote count is 0
   */
  async removeVote(noteId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
