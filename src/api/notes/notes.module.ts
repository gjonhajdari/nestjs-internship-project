import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { RoomsModule } from "../rooms/rooms.module";
import { NoteVote } from "./entities/note-vote.entity";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { ParsingProvider } from "./providers/parsing.provider";
import { NotesRepository } from "./repository/notes.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteVote]),
    CustomRepositoryModule.forCustomRepository([NotesRepository]),
    RoomsModule,
  ],
  controllers: [NotesController],
  providers: [NotesService, ParsingProvider],
  exports: [NotesService],
})
export class NotesModule {}
