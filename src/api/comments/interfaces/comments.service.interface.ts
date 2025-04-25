import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";

export interface ICommentsService {
  findAllComments(noteId: string): Promise<Comment[]>;

  createComment(payload: CreateCommentDto): Promise<Comment>;

  updateComment(commentId: string, payload: UpdateCommentDto): Promise<Comment>;

  deleteComment(commentId: string): Promise<boolean>;
}
