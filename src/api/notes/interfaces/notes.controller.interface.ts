import { IDeleteStatus } from "../../../common/interfaces/DeleteStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";
import { IAddVoteNote, IRemoveVoteNote, IUpdateNote } from "./notes-response.interface";

export interface INotesController {
  findAll(roomId: string): Promise<Note[]>;

  create(body: CreateNoteDto, currentUser: User): Promise<Note>;

  update(noteId: string, body: UpdateNoteDto, currentUser: User): Promise<IUpdateNote>;

  delete(noteId: string): Promise<IDeleteStatus>;

  addVote(noteId: string, currentUser: User): Promise<IAddVoteNote>;

  removeVote(noteId: string, currentUser: User): Promise<IRemoveVoteNote>;
}
