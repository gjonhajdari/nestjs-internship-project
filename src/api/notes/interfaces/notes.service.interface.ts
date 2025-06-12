import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";

export interface INotesService {
  findNotesFromRoom(roomId: string): Promise<Note[]>;

  createNote(payload: CreateNoteDto, currentUser: User): Promise<Note>;

  updateNote(noteId: string, payload: UpdateNoteDto, currentUser: User): Promise<Note>;

  deleteNote(noteId: string): Promise<IResponseStatus>;

  addVote(noteId: string, currentUser: User): Promise<boolean>;

  removeVote(noteId: string, currentUser: User): Promise<boolean>;
}
