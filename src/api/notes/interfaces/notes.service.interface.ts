import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";

export interface INotesService {
  findAll(roomId: string): Promise<Note[]>;

  create(payload: CreateNoteDto): Promise<Note>;

  updateNote(noteId: string, payload: UpdateNoteDto): Promise<Note>;

  removeNote(noteId: string): Promise<void>;

  addVote(noteId: string): Promise<boolean>;

  removeVote(noteId: string): Promise<boolean>;
}
