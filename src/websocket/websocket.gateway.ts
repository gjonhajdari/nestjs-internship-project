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
import { plainToInstance } from "class-transformer";
import * as jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { UpdateCommentDto } from "src/api/comments/dtos/update-comment.dto";
import { Comment } from "src/api/comments/entities/comment.entity";
import { Note } from "src/api/notes/entities/note.entity";
import { WsAuthGuard } from "src/common/ws-guards/auth.guard";
import { CommentsService } from "../api/comments/comments.service";
import { CreateCommentDto } from "../api/comments/dtos/create-comment.dto";
import { CreateNoteDto } from "../api/notes/dtos/create-note.dto";
import { UpdateNoteDto } from "../api/notes/dtos/update-note.dto";
import { NotesService } from "../api/notes/notes.service";
import { RoomsService } from "../api/rooms/rooms.service";
import { UsersService } from "../api/user/users.service";

@WebSocketGateway()
@UseGuards(WsAuthGuard)
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomsService: RoomsService,
    private notesService: NotesService,
    private usersService: UsersService,
    private commentsService: CommentsService,
  ) {}

  handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.Authorization?.split(" ")[1];

    if (!token) {
      return socket.disconnect();
    }

    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      (socket as any).user = payload;
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

  @SubscribeMessage("leaveRoom")
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    const userId = (socket as any).user;
    socket.leave(roomId);
    this.server.to(roomId).emit("userLeft", { userId: userId });
  }

  @SubscribeMessage("createNote")
  async handleNewNote(@MessageBody() data: CreateNoteDto, @ConnectedSocket() socket: Socket) {
    const { id } = (socket as any).user;
    const user = await this.usersService.findOne(id);
    const { roomId } = data;
    try {
      const newNote = await this.notesService.createNote(data, user);
      this.server.to(roomId).emit("newNote", plainToInstance(Note, newNote));
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
    const { id } = (socket as any).user;
    const user = await this.usersService.findOne(id);
    const { roomId, noteId, updates } = data;
    try {
      const updatedNote = await this.notesService.updateNote(noteId, updates, user);
      this.server.to(roomId).emit("updatedNote", plainToInstance(Note, updatedNote));
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
      this.server.to(roomId).emit("deletedNote", deletedNote);
    } catch (error) {
      socket.emit("Error in handleDeleteNote", error.message);
    }
  }

  @SubscribeMessage("addComment")
  async handleNewComment(
    @MessageBody() data: { roomId: string; payload: CreateCommentDto },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = (socket as any).user;
    const { roomId, payload } = data;
    try {
      const newComment = await this.commentsService.createComment(id, payload);
      this.server.to(roomId).emit("newComment", plainToInstance(Comment, newComment));
    } catch (error) {
      socket.emit("Error in handleNewComment", error.message);
    }
  }

  @SubscribeMessage("editComment")
  async handleEditComment(
    @MessageBody() data: { roomId: string; commentId: string; payload: UpdateCommentDto },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = (socket as any).user;
    const { roomId, commentId, payload } = data;
    try {
      const updatedComment = await this.commentsService.updateComment(id, commentId, payload);
      this.server.to(roomId).emit("updatedComment", plainToInstance(Comment, updatedComment));
    } catch (error) {
      socket.emit("Error in handleEditComment", error.message);
    }
  }

  @SubscribeMessage("deleteComment")
  async handleDeleteComment(
    @MessageBody() data: { roomId: string; commentId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = (socket as any).user;
    const { roomId, commentId } = data;
    try {
      const deletedComment = await this.commentsService.deleteComment(commentId);
      this.server.to(roomId).emit("deletedComment", deletedComment);
    } catch (error) {
      socket.emit("Error in handleDeleteComment", error.message);
    }
  }
}
