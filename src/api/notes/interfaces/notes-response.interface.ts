import { NoteColor } from "../enums/note-color.enum";
export interface INoteViewport {
  uuid: string;
  content: string;
  totalVotes: number;
  color: NoteColor;
  firstName: string;
  lastName: string;
}
export interface INoteViewportRaw {
  uuid: string;
  content: string;
  totalvotes: number;
  color: NoteColor;
  firstname: string;
  lastname: string;
  xaxis: number;
  yaxis: number;
}

export interface ICreateNote {
  uuid: string;
  content: string;
  color: NoteColor;
  xAxis: number;
  yAxis: number;
  totalVotes: number;
  author: {
    fullName: string;
  };
  room: {
    uuid: string;
  };
}

export interface IUpdateNote {
  uuid: string;
  content: string;
  color: NoteColor;
  totalVotes: number;
  xAxis: number;
  yAxis: number;
}

export interface INoteVoteRaw {
  uuid: string;
  firstname: string;
  lastname: string;
}

export interface INoteVote {
  uuid: string;
  firstName: string;
  lastName: string;
}

export interface IRemoveVoteNote {
  success: boolean;
  message: string;
}

export interface IAddVoteNote extends IRemoveVoteNote {
  voteSwitched: boolean;
}
