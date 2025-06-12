import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { Comment } from "../entities/comment.entity";

export interface ICommentsController {
  findAll(noteId: string): Promise<Comment[]>;

  create(user: User, body: CreateCommentDto): Promise<Comment>;

  update(user: User, commendId: string, body: UpdateCommentDto): Promise<Comment>;

  delete(commentId: string): Promise<IResponseStatus>;
}
