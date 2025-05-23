import { UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { instanceToPlain } from "class-transformer";
import { Server, Socket } from "socket.io";
import { CommentsService } from "src/api/comments/comments.service";
import { CreateCommentDto } from "src/api/comments/dtos/create-comment.dto";
import { WsAuthGuard } from "src/common/ws-guards/auth.guard";
import { CreateNoteDto } from "../api/notes/dtos/create-note.dto";
import { UpdateNoteDto } from "../api/notes/dtos/update-note.dto";
import { NotesService } from "../api/notes/notes.service";
import { RoomsService } from "../api/rooms/rooms.service";

@WebSocketGateway()
@UseGuards(WsAuthGuard)
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private TIMEOUT = 600000;
  private userTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private roomsService: RoomsService,
    private notesService: NotesService,
    private commentsService: CommentsService,
  ) {}

  handleConnection(socket: Socket) {
    // this.resetTimeout(socket);
    console.log(`Client connected: ${socket.id}`);

    // socket.onAny(() => {
    //   this.resetTimeout(socket);
    // });
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage("enterRoom")
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const { roomId } = data;
      const userId = (socket as any).user;

      socket.join(roomId);

      this.server.to(roomId).emit("userEntered", { userId });
    } catch (error) {
      socket.emit("error", { message: "Failed to join room", detail: error.message });
    }
  }

  @SubscribeMessage("createNote")
  async handleNewNote(@MessageBody() data: CreateNoteDto, @ConnectedSocket() socket: Socket) {
    const { roomId } = data;
    try {
      const newNote = await this.notesService.createNote(data);

      this.server.to(roomId).emit("newNote", instanceToPlain(newNote));
    } catch (error) {
      socket.emit("error", { message: "Failed to create note", detail: error.message });
    }
  }

  @SubscribeMessage("updateNote")
  async handleUpdateNote(
    @MessageBody() data: { roomId: string; noteId: string; updates: UpdateNoteDto },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, noteId, updates } = data;
    try {
      const updatedNote = await this.notesService.updateNote(noteId, updates);
      this.server.to(roomId).emit("updatedNote", instanceToPlain(updatedNote));
    } catch (error) {
      socket.emit("Error in handleUpdateNote", error.message);
    }
  }

  @SubscribeMessage("deleteNote")
  async handleDeleteNote(
    @MessageBody() data: { roomId: string; noteId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, noteId } = data;
    try {
      const deletedNote = await this.notesService.deleteNote(noteId);
      this.server.to(roomId).emit("deletedNote", { deletedNote });
    } catch (error) {
      socket.emit("Error in handleDeleteNote", error.message);
    }
  }

  @SubscribeMessage("addComment")
  async handleAddComment(
    @MessageBody() data: { roomI: string; noteId: string; payload: CreateCommentDto },
    @ConnectedSocket() socket: Socket,
  ) {
    const { noteId } = data;
    const { payload } = data;
    try {
      const newComment = await this.commentsService.createComment(payload);
    } catch (error) {
      socket.emit("Error in handleAddComment", error.message);
    }
  }

  // private resetTimeout(socket: Socket) {
  //   this.clearTimeout(socket);
  //   const timeout = setTimeout(() => {
  //     socket.emit("inactive", { message: "Disconnected due to inactivity" });
  //     console.log("Disconected due to inactivity");
  //     socket.disconnect(true);
  //   }, this.TIMEOUT);
  //   this.userTimeouts.set(socket.id, timeout);
  // }

  // private clearTimeout(socket: Socket) {
  //   const existing = this.userTimeouts.get(socket.id);
  //   if (existing) clearTimeout(existing);
  //   this.userTimeouts.delete(socket.id);
  // }
}
