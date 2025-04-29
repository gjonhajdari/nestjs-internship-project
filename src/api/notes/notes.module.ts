import { Module } from "@nestjs/common";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { NotesRepository } from "./repository/notes.repository";

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([NotesRepository])],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
