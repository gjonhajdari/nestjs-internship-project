import { IDeleteStatus } from "../../../common/interfaces/DeleteStatus.interface";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { Comment } from "../entities/comment.entity";

export interface ICommentsService {
  findById(commentId: string, relations?: string[]): Promise<Comment>;

  findComments(noteId: string): Promise<Comment[]>;

  createComment(userId: string, payload: CreateCommentDto): Promise<Comment>;

  updateComment(
    userId: string,
    commentId: string,
    payload: UpdateCommentDto,
  ): Promise<Comment>;

  deleteComment(commentId: string): Promise<IDeleteStatus>;
}
