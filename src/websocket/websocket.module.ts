import { Module } from "@nestjs/common";
import { ActivitiesModule } from "src/api/activities/activities.module";
import { CommentsModule } from "src/api/comments/comments.module";
import { UserModule } from "src/api/user/users.module";
import { NotesModule } from "../api/notes/notes.module";
import { RoomsModule } from "../api/rooms/rooms.module";
import { WebsocketGateway } from "./websocket.gateway";

@Module({
  imports: [RoomsModule, NotesModule, UserModule, CommentsModule, ActivitiesModule],
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
