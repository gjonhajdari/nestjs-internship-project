import { Module } from "@nestjs/common";
import { CustomRepositoryModule } from "src/common/db/CustomRepository.module";
import { NotesModule } from "../notes/notes.module";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { CommentsRepository } from "./repository/comments.repository";

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([CommentsRepository]), NotesModule],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
