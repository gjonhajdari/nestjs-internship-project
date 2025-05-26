import { BaseCustomRepository } from "../../../common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "../../../common/db/decorators/CustomRepository.decorator";
import { Comment } from "../entities/comment.entity";
import { ICommentsRepository } from "../interfaces/comments.repository.interface";

@CustomRepository(Comment)
export class CommentsRepository
  extends BaseCustomRepository<Comment>
  implements ICommentsRepository {}
