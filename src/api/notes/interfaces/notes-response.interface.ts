import { Note } from "../entities/note.entity";

export interface IUpdateNote {
  message: string;
  note: Note;
}

export interface IRemoveVoteNote {
  success: boolean;
  message: string;
}

export interface IAddVoteNote extends IRemoveVoteNote {
  voteSwitched: boolean;
}
