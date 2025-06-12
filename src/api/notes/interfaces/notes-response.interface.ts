import { User } from "../../user/entities/user.entity";
import { Note } from "../entities/note.entity";

export interface IUpdateNote {
  note: Note;
  updatedBy: User;
}

export interface IRemoveVoteNote {
  success: boolean;
  message: string;
}

export interface IAddVoteNote extends IRemoveVoteNote {
  voteSwitched: boolean;
}
