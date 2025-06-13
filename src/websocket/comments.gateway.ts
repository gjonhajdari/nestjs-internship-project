import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { plainToInstance } from "class-transformer";
import { Socket } from "socket.io";
import { ActivitiesService } from "src/api/activities/activities.service";
import { UpdateCommentDto } from "src/api/comments/dtos/update-comment.dto";
import { Comment } from "src/api/comments/entities/comment.entity";
import { CommentsService } from "../api/comments/comments.service";
import { CreateCommentDto } from "../api/comments/dtos/create-comment.dto";
import { BaseWebsocketGateway } from "./base-websocket.gateway";

@WebSocketGateway()
export class CommentsGateway extends BaseWebsocketGateway {
  constructor(
    private commentsService: CommentsService,
    private activitiesService: ActivitiesService,
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
    try {
      const deletedComment = await this.commentsService.deleteComment(commentId);
      this.server.to(roomId).emit("comments/deleted", deletedComment);
    } catch (error) {
      socket.emit("Error in handleDeleteComment", error.message);
    }
  }
}
