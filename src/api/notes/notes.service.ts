import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import { INotesService } from "./interfaces/notes.service.interface";
import { NotesRepository } from "./repository/notes.repository";

// TODO: implement INotesService interface
@Injectable()
export class NotesService implements INotesService {
  constructor(private notesRepository: NotesRepository) {}

  async findById(noteId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { uuid: noteId } });

    if (!note) throw new NotFoundException("Note does not exist");

    return note;
  }

  findAll(roomId: string): Promise<Note[]> {
    throw new Error("Method not implemented.");
  }
  create(createNoteDto: CreateNoteDto): Promise<Note> {
    throw new Error("Method not implemented.");
  }
  updateNote(noteId: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    throw new Error("Method not implemented.");
  }
  removeNote(noteId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  addVote(noteId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  removeVote(noteId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
