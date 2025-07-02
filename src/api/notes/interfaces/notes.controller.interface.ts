import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { ExportNotesDto } from "../dtos/export-notes.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";

import { Response } from "express";
import { NotesViewportDto } from "../dtos/notes-viewport.dto";
import { Note } from "../entities/note.entity";
import {
  IAddVoteNote,
  ICreateNote,
  INoteVote,
  INoteWithAuthor,
  IRemoveVoteNote,
  IUpdateNote,
} from "./notes-response.interface";

export interface INotesController {
  findAll(roomId: string, bounds: NotesViewportDto): Promise<Partial<Note>[]>;

  noteWinner(roomId: string): Promise<{ uuid: string }[]>;

  create(body: CreateNoteDto, currentUser: User): Promise<ICreateNote>;

  update(noteId: string, body: UpdateNoteDto, currentUser: User): Promise<IUpdateNote>;

  delete(noteId: string): Promise<IResponseStatus>;

  findVotes(noteId: string): Promise<INoteVote[]>;

  addVote(noteId: string, currentUser: User): Promise<IAddVoteNote>;

  removeVote(noteId: string, currentUser: User): Promise<IRemoveVoteNote>;

  exportNotes(query: ExportNotesDto, res: Response): Promise<void>;

  getOne(noteId: string): Promise<INoteWithAuthor>;
}
