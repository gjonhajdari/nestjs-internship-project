import { BaseCustomRepository } from "src/common/db/customBaseRepository/BaseCustomRepository";
import { Comment } from "../entities/comment.entity";

export interface ICommentsRepository extends BaseCustomRepository<Comment> {}
