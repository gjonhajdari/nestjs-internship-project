import { Module } from "@nestjs/common";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { NoteRepository } from "./repository/note.repository";

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([NoteRepository])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
