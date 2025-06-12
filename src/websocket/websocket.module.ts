import { Module } from "@nestjs/common";
import { ActivitiesModule } from "src/api/activities/activities.module";
import { CommentsModule } from "src/api/comments/comments.module";
import { UserModule } from "src/api/user/users.module";
import { NotesModule } from "../api/notes/notes.module";
import { RoomsModule } from "../api/rooms/rooms.module";
import { BaseWebsocketGateway } from "./base-websocket.gateway";
import { CommentsGateway } from "./comments.gateway";
import { NotesGateway } from "./notes.gateway";
import { RoomsGateway } from "./rooms.gateway";

@Module({
  imports: [RoomsModule, NotesModule, UserModule, CommentsModule, ActivitiesModule],
  providers: [BaseWebsocketGateway, RoomsGateway, NotesGateway, CommentsGateway],
})
export class WebsocketModule {}
