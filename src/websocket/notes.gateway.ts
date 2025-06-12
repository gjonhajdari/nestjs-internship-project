import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { plainToInstance } from "class-transformer";
import { Socket } from "socket.io";
import { ActivitiesService } from "src/api/activities/activities.service";
import { Note } from "src/api/notes/entities/note.entity";
import { ActivityType } from "src/common/enums/activity-type.enum";
import { ResourceType } from "src/common/enums/resource-type.enum";
import { CreateNoteDto } from "../api/notes/dtos/create-note.dto";
import { UpdateNoteDto } from "../api/notes/dtos/update-note.dto";
import { NotesService } from "../api/notes/notes.service";
import { UsersService } from "../api/user/users.service";
import { BaseWebsocketGateway } from "./base-websocket.gateway";

@WebSocketGateway()
export class NotesGateway extends BaseWebsocketGateway {
  constructor(
    private notesService: NotesService,
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
  ) {
    super();
  }

  @SubscribeMessage("notes/create")
  async handleNewNote(@MessageBody() data: CreateNoteDto, @ConnectedSocket() socket: Socket) {
    const { id } = (socket as any).user;
    const user = await this.usersService.findOne(id);
    const { roomId } = data;
    try {
      const newNote = await this.notesService.createNote(data, user);
      const activity = await this.activitiesService.createActivity(
        roomId,
        user.uuid,
        ActivityType.CREATE,
        ResourceType.NOTE,
        newNote.uuid,
      );

      this.server.to(roomId).emit("notes/created", plainToInstance(Note, newNote));
      this.emitActivity(roomId, activity);
    } catch (error) {
      socket.emit("error", {
        message: "Failed to create note",
        detail: error.message,
      });
    }
  }

  @SubscribeMessage("notes/update")
  async handleUpdateNote(
    @MessageBody()
    data: { roomId: string; noteId: string; updates: UpdateNoteDto },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = (socket as any).user;
    const user = await this.usersService.findOne(id);
    const { roomId, noteId, updates } = data;
    try {
      const updatedNote = await this.notesService.updateNote(noteId, updates, user);
      const activity = await this.activitiesService.createActivity(
        roomId,
        user.uuid,
        ActivityType.UPDATE,
        ResourceType.NOTE,
        updatedNote.uuid,
      );

      this.server.to(roomId).emit("notes/updated", plainToInstance(Note, updatedNote));
      this.emitActivity(roomId, activity);
    } catch (error) {
      socket.emit("Error in handleUpdateNote", error.message);
    }
  }

  @SubscribeMessage("notes/delete")
  async handleDeleteNote(
    @MessageBody() data: { roomId: string; noteId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = (socket as any).user;
    const user = await this.usersService.findOne(id);
    const { roomId, noteId } = data;
    try {
      const deletedNote = await this.notesService.deleteNote(noteId);
      const activity = await this.activitiesService.createActivity(
        roomId,
        user.uuid,
        ActivityType.DELETE,
        ResourceType.NOTE,
        noteId,
      );

      this.server.to(roomId).emit("notes/deleted", deletedNote);
      this.emitActivity(roomId, activity);
    } catch (error) {
      socket.emit("Error in handleDeleteNote", error.message);
    }
  }
}
