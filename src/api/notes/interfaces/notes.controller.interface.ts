import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";

export interface INotesController {
  findAll(roomId: string): Promise<Note[]>;

  create(body: CreateNoteDto): Promise<Note>;

  update(noteId: string, body: UpdateNoteDto): Promise<Note>;

  delete(noteId: string): Promise<void>;

  addVote(noteId: string): Promise<boolean>;

  removeVote(noteId: string): Promise<boolean>;
}
