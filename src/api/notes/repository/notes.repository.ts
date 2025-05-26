import { BaseCustomRepository } from "../../../common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "../../../common/db/decorators/CustomRepository.decorator";
import { Note } from "../entities/note.entity";
import { INotesRepository } from "../interfaces/notes.repository.interface";

@CustomRepository(Note)
export class NotesRepository extends BaseCustomRepository<Note> implements INotesRepository {}
