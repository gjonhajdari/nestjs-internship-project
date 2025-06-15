import { BadRequestException } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { plainToInstance } from "class-transformer";
import { Socket } from "socket.io";
import { ActivitiesService } from "../api/activities/activities.service";
import { CommentsService } from "../api/comments/comments.service";
import { CreateCommentDto } from "../api/comments/dtos/create-comment.dto";
import { UpdateCommentDto } from "../api/comments/dtos/update-comment.dto";
import { Comment } from "../api/comments/entities/comment.entity";
import { RoomsService } from "../api/rooms/rooms.service";
import { BaseWebsocketGateway } from "./base-websocket.gateway";

@WebSocketGateway()
export class CommentsGateway extends BaseWebsocketGateway {
  constructor(
    private commentsService: CommentsService,
    private activitiesService: ActivitiesService,
    private roomsService: RoomsService,
  ) {
    super();
  }

  @SubscribeMessage("comments/create")
  async handleNewComment(
    @MessageBody() data: { roomId: string; payload: CreateCommentDto },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = (socket as any).user;
    const { roomId, payload } = data;
    const room = await this.roomsService.findById(roomId);
    if (room.isActive === false) {
      throw new BadRequestException();
    }
    try {
      const newComment = await this.commentsService.createComment(id, payload);
      this.server.to(roomId).emit("comments/created", plainToInstance(Comment, newComment));
    } catch (error) {
      socket.emit("Error in handleNewComment", error.message);
    }
  }

  @SubscribeMessage("comments/update")
  async handleEditComment(
    @MessageBody() data: { roomId: string; commentId: string; payload: UpdateCommentDto },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = (socket as any).user;
    const { roomId, commentId, payload } = data;
    const room = await this.roomsService.findById(roomId);
    if (room.isActive === false) {
      throw new BadRequestException();
    }
    try {
      const updatedComment = await this.commentsService.updateComment(id, commentId, payload);
      this.server
        .to(roomId)
        .emit("comments/updated", plainToInstance(Comment, updatedComment));
    } catch (error) {
      socket.emit("Error in handleEditComment", error.message);
    }
  }

  @SubscribeMessage("comments/delete")
  async handleDeleteComment(
    @MessageBody() data: { roomId: string; commentId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = (socket as any).user;
    const { roomId, commentId } = data;
    const room = await this.roomsService.findById(roomId);
    if (room.isActive === false) {
      throw new BadRequestException();
    }

    const comment = await this.commentsService.findById(commentId);
    try {
      const deletedComment = await this.commentsService.deleteComment(commentId);
      this.server.to(roomId).emit("comments/deleted", deletedComment);
    } catch (error) {
      socket.emit("Error in handleDeleteComment", error.message);
    }
  }
}
