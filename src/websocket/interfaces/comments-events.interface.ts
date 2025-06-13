import { CreateCommentDto } from "src/api/comments/dtos/create-comment.dto";
import { UpdateCommentDto } from "src/api/comments/dtos/update-comment.dto";
import { Comment } from "src/api/comments/entities/comment.entity";
import { IResponseStatus } from "src/common/interfaces/ResponseStatus.interface";

export interface CommentsListenEvents {
  "comments/create": (data: { roomId: string; payload: CreateCommentDto }) => void;
  "comments/update": (data: {
    roomId: string;
    commentId: string;
    payload: UpdateCommentDto;
  }) => void;
  "comments/delete": (data: { roomId: string; commentId: string }) => void;
}

export interface CommentsEmitEvents {
  "comments/created": (comment: Comment) => void;
  "comments/updated": (comment: Comment) => void;
  "comments/deleted": (comment: IResponseStatus) => void;
}
