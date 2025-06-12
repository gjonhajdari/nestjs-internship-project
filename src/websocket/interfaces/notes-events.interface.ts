import { CreateNoteDto } from "src/api/notes/dtos/create-note.dto";
import { UpdateNoteDto } from "src/api/notes/dtos/update-note.dto";
import { Note } from "src/api/notes/entities/note.entity";
import { IResponseStatus } from "src/common/interfaces/ResponseStatus.interface";

export interface NotesListenEvents {
  "notes/create": (data: CreateNoteDto) => void;
  "notes/update": (data: { roomId: string; noteId: string; updates: UpdateNoteDto }) => void;
  "notes/delete": (data: { roomId: string; noteId: string }) => void;
}

export interface NotesEmitEvents {
  "notes/created": (note: Note) => void;
  "notes/updated": (note: Note) => void;
  "notes/deleted": (note: IResponseStatus) => void;
}
