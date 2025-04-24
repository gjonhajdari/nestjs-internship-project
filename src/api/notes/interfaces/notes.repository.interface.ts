import { IBaseCustomRepository } from "../../../common/db/customBaseRepository/interfaces/BaseCustomRepository.interface";
import { Note } from "../entities/note.entity";

export interface INotesRepository extends IBaseCustomRepository<Note> {}
