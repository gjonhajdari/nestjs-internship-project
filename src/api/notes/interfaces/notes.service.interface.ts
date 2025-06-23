import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { NotesViewportDto } from "../dtos/notes-viewport.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import {
  IAddVoteNote,
  ICreateNote,
  INoteViewport,
  IRemoveVoteNote,
  IUpdateNote,
} from "./notes-response.interface";

export interface INotesService {
  getNotesInViewport(roomId: string, bounds: NotesViewportDto): Promise<INoteViewport[]>;

  createNote(payload: CreateNoteDto, currentUser: User): Promise<ICreateNote>;

  updateNote(noteId: string, payload: UpdateNoteDto, currentUser: User): Promise<IUpdateNote>;

  deleteNote(noteId: string): Promise<IResponseStatus>;

  addVote(noteId: string, currentUser: User): Promise<IAddVoteNote>;

  removeVote(noteId: string, currentUser: User): Promise<IRemoveVoteNote>;
}
