import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";

export interface INotesController {
  findAll(roomId: string): Promise<Note[]>;

  create(body: CreateNoteDto, currentUser: User): Promise<Note>;

  update(noteId: string, body: UpdateNoteDto, currentUser: User): Promise<Note>;

  delete(noteId: string): Promise<IResponseStatus>;

  addVote(noteId: string, currentUser: User): Promise<boolean>;

  removeVote(noteId: string, currentUser: User): Promise<boolean>;
}
