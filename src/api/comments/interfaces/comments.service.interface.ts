import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { Comment } from "../entities/comment.entity";

export interface ICommentsService {
  findComments(noteId: string): Promise<Comment[]>;

  createComment(payload: CreateCommentDto): Promise<Comment>;

  updateComment(commentId: string, payload: UpdateCommentDto): Promise<Comment>;

  deleteComment(commentId: string): Promise<boolean>;
}
