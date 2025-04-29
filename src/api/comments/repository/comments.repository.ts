import { BaseCustomRepository } from "src/common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "src/common/db/decorators/CustomRepository.decorator";
import { Comment } from "../entities/comment.entity";
import { ICommentsRepository } from "../interfaces/comments.repository.interface";

@CustomRepository(Comment)
export class CommentsRepository
  extends BaseCustomRepository<Comment>
  implements ICommentsRepository {}
