import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import { INotesService } from "./interfaces/notes.service.interface";
import { NotesRepository } from "./repository/notes.repository";

@Injectable()
export class NotesService implements INotesService {
  constructor(private notesRepository: NotesRepository) {}

  async findById(noteId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { uuid: noteId } });

    if (!note) throw new NotFoundException("Note does not exist");

    return note;
  }

  async findAll(roomId: string): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { room: { uuid: roomId } },
      relations: ["room"],
    });
  }

  /**
   *
   * @param payload
   */
  async create(payload: CreateNoteDto): Promise<Note> {
    throw new Error("Method not implemented.");
  }

  async updateNote(noteId: string, payload: UpdateNoteDto): Promise<Note> {
    throw new Error("Method not implemented.");
  }
  async deleteNote(noteId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async addVote(noteId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async removeVote(noteId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
