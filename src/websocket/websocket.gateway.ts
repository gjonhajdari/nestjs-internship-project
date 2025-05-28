import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { CreateNoteDto } from "../api/notes/dtos/create-note.dto";
import { UpdateNoteDto } from "../api/notes/dtos/update-note.dto";
import { NotesService } from "../api/notes/notes.service";
import { RoomsService } from "../api/rooms/rooms.service";

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomsService: RoomsService,
    private notesService: NotesService,
  ) {}

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
    const token = socket.handshake.auth?.Authorization?.split(" ")[1];

    if (!token) {
      console.warn("No token provided");
      return socket.disconnect();
    }

    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      (socket as any).user = payload;
      console.log("Connected user:", payload);
    } catch (err) {
      console.warn("Invalid or expired token");
      return socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage("joinRoom")
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const { roomId } = data;
      const userId = (socket as any).user;

      socket.join(roomId);

      this.server.to(roomId).emit("userJoined", { userId });
    } catch (error) {
      socket.emit("error", {
        message: "Failed to join room",
        detail: error.message,
      });
    }
  }

  @SubscribeMessage("createNote")
  async handleNewNote(@MessageBody() data: CreateNoteDto, @ConnectedSocket() socket: Socket) {
    const { roomId } = data;
    try {
      const newNote = await this.notesService.createNote(data);

      this.server.to(roomId).emit("newNote", { newNote });
    } catch (error) {
      socket.emit("error", {
        message: "Failed to create note",
        detail: error.message,
      });
    }
  }

  @SubscribeMessage("updateNote")
  async handleUpdateNote(
    @MessageBody()
    data: { roomId: string; noteId: string; updates: UpdateNoteDto },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log("DATA FROM FRONT", data);
    const { roomId, noteId, updates } = data;
    try {
      const updatedNote = await this.notesService.updateNote(noteId, updates);
      console.log("THE UPDATED NOTE", updatedNote);
      this.server.to(roomId).emit("updatedNote", { updatedNote });
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
}
