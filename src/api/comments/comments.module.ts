import { Module } from "@nestjs/common";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { NotesModule } from "../notes/notes.module";
import { UserModule } from "../user/users.module";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { CommentsRepository } from "./repository/comments.repository";

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([CommentsRepository]),
    NotesModule,
    UserModule,
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
