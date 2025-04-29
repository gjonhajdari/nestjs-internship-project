import { BaseCustomRepository } from "src/common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "src/common/db/decorators/CustomRepository.decorator";
import { Note } from "../entities/note.entity";
import { INotesRepository } from "../interfaces/notes.repository.interface";

@CustomRepository(Note)
export class NotesRepository extends BaseCustomRepository<Note> implements INotesRepository {}
