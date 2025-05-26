import { IDeleteStatus } from "../../../common/interfaces/DeleteStatus.interface";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { Comment } from "../entities/comment.entity";

export interface ICommentsController {
  findAll(noteId: string): Promise<Comment[]>;

  create(userId: string, body: CreateCommentDto): Promise<Comment>;

  update(commendId: string, body: UpdateCommentDto): Promise<Comment>;

  delete(commentId: string): Promise<IDeleteStatus>;
}
