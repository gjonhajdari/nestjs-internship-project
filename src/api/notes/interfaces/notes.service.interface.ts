import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { ExportNotesDto } from "../dtos/export-notes.dto";
import { NotesViewportDto } from "../dtos/notes-viewport.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";
import { Note } from "../entities/note.entity";
import { IExportedFile } from "./exported-file.interface";
import {
  IAddVoteNote,
  ICreateNote,
  INoteViewport,
  INoteVote,
  INoteWithAuthor,
  IRemoveVoteNote,
  IUpdateNote,
} from "./notes-response.interface";

export interface INotesService {
  getNotesInViewport(roomId: string, bounds: NotesViewportDto): Promise<INoteViewport[]>;

  findById(noteId: string, relations?: string[]): Promise<Note>;

  createNote(payload: CreateNoteDto, currentUser: User): Promise<ICreateNote>;

  updateNote(noteId: string, payload: UpdateNoteDto, currentUser: User): Promise<IUpdateNote>;

  findNoteByIdWithAuthor(noteId: string): Promise<INoteWithAuthor>;

  deleteNote(noteId: string): Promise<IResponseStatus>;

  getCurrentNoteVoteWinners(roomId: string): Promise<{ uuid: string }[]>;

  addVote(noteId: string, currentUser: User): Promise<IAddVoteNote>;

  removeVote(noteId: string, currentUser: User): Promise<IRemoveVoteNote>;

  findAllNoteVotes(noteId: string): Promise<INoteVote[]>;

  exportNotes(query: ExportNotesDto): Promise<IExportedFile>;
}
