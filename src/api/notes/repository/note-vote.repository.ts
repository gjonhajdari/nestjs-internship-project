import { BaseCustomRepository } from "../../../common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "../../../common/db/decorators/CustomRepository.decorator";
import { NoteVote } from "../entities/note-vote.entity";
import { INoteVoteRepository } from "../interfaces/note-votes-repository.interface";

@CustomRepository(NoteVote)
export class NoteVoteRepository
  extends BaseCustomRepository<NoteVote>
  implements INoteVoteRepository {}
