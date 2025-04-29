import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";

export interface INotesController {
  getAllNotesFromRoom(roomId: string): Promise<Note[]>;

  createNewNote(body: CreateNoteDto): Promise<Note>;

  updateNote(noteId: string, body: UpdateNoteDto): Promise<Note>;

  removeNote(noteId: string): Promise<void>;

  addVote(noteId: string): Promise<boolean>;

  removeVote(noteId: string): Promise<boolean>;
}
