import { Module } from "@nestjs/common";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { RoomsModule } from "../rooms/rooms.module";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { NotesRepository } from "./repository/notes.repository";

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([NotesRepository]), RoomsModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
