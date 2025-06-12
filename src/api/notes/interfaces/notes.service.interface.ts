import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";
import { IAddVoteNote, IRemoveVoteNote, IUpdateNote } from "./notes-response.interface";

export interface INotesService {
  findNotesWithVotesFromRoom(roomId: string): Promise<Note[]>;

  createNote(payload: CreateNoteDto, currentUser: User): Promise<Note>;

  updateNote(noteId: string, payload: UpdateNoteDto, currentUser: User): Promise<IUpdateNote>;

  deleteNote(noteId: string): Promise<IResponseStatus>;

  addVote(noteId: string, currentUser: User): Promise<IAddVoteNote>;

  removeVote(noteId: string, currentUser: User): Promise<IRemoveVoteNote>;
}
