import { BaseCustomRepository } from "../../../common/db/customBaseRepository/BaseCustomRepository";
import { Comment } from "../entities/comment.entity";

export interface ICommentsRepository extends BaseCustomRepository<Comment> {}
