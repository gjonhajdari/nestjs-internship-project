import { IDeleteStatus } from "../../../common/interfaces/DeleteStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";

export interface INotesService {
  findNotesFromRoom(roomId: string): Promise<Note[]>;

  createNote(payload: CreateNoteDto, currentUser: User): Promise<Note>;

  updateNote(noteId: string, payload: UpdateNoteDto, currentUser: User): Promise<Note>;

  deleteNote(noteId: string): Promise<IDeleteStatus>;

  addVote(noteId: string, currentUser: User): Promise<boolean>;

  removeVote(noteId: string, currentUser: User): Promise<boolean>;
}
