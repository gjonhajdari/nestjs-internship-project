import { Module } from "@nestjs/common";
import { NotesModule } from "../api/notes/notes.module";
import { RoomsModule } from "../api/rooms/rooms.module";
import { WebsocketGateway } from "./websocket.gateway";

@Module({
  imports: [RoomsModule, NotesModule],
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
