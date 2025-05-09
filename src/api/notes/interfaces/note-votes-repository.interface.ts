import { IBaseCustomRepository } from "../../../common/db/customBaseRepository/interfaces/BaseCustomRepository.interface";
import { NoteVote } from "../entities/note-vote.entity";

export interface INoteVoteRepository extends IBaseCustomRepository<NoteVote> {}
