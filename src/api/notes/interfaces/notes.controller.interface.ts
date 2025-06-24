import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { NotesViewportDto } from "../dtos/notes-viewport.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";
import {
  IAddVoteNote,
  ICreateNote,
  IRemoveVoteNote,
  IUpdateNote,
} from "./notes-response.interface";

export interface INotesController {
  findAll(roomId: string, bounds: NotesViewportDto): Promise<Partial<Note>[]>;

  noteWinner(roomId: string): Promise<{ uuid: string }[]>;

  create(body: CreateNoteDto, currentUser: User): Promise<ICreateNote>;

  update(noteId: string, body: UpdateNoteDto, currentUser: User): Promise<IUpdateNote>;

  delete(noteId: string): Promise<IResponseStatus>;

  addVote(noteId: string, currentUser: User): Promise<IAddVoteNote>;

  removeVote(noteId: string, currentUser: User): Promise<IRemoveVoteNote>;
}
