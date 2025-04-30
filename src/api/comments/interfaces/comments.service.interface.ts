import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { Comment } from "../entities/comment.entity";

export interface ICommentsService {
  findById(commentId: string): Promise<Comment>;

  findComments(noteId: string): Promise<Comment[]>;

  createComment(payload: CreateCommentDto): Promise<Comment>;

  updateComment(commentId: string, payload: UpdateCommentDto): Promise<Comment>;

  deleteComment(commentId: string): Promise<IDeleteStatus>;
}
