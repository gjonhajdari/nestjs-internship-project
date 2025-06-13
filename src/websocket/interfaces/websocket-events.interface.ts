import { CommentsEmitEvents, CommentsListenEvents } from "./comments-events.interface";
import { NotesEmitEvents, NotesListenEvents } from "./notes-events.interface";
import { RoomsEmitEvents, RoomsListenEvents } from "./rooms-events.interface";

export interface EmitEvents extends RoomsEmitEvents, NotesEmitEvents, CommentsEmitEvents {
  activity: (activity: any) => void;
  error: (error: { message: string; detail?: string }) => void;
}

export interface ListenEvents
  extends RoomsListenEvents,
    NotesListenEvents,
    CommentsListenEvents {}
