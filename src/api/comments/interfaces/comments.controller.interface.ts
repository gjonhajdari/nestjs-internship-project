import { User } from "src/api/user/entities/user.entity";
import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { Comment } from "../entities/comment.entity";

export interface ICommentsController {
  findAll(noteId: string): Promise<Comment[]>;

  create(user: User, body: CreateCommentDto): Promise<Comment>;

  update(user: User, commendId: string, body: UpdateCommentDto): Promise<Comment>;

  delete(commentId: string): Promise<IResponseStatus>;
}
