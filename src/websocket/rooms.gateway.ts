import { BadRequestException } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ActivitiesService } from "../api/activities/activities.service";
import { RoomsService } from "../api/rooms/rooms.service";
import { BaseWebsocketGateway } from "./base-websocket.gateway";

@WebSocketGateway()
export class RoomsGateway extends BaseWebsocketGateway {
  constructor(
    private roomsService: RoomsService,
    private activitiesService: ActivitiesService,
  ) {
    super();
  }

  @SubscribeMessage("rooms/join")
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    const userId = (socket as any).user;
    const room = await this.roomsService.findById(roomId);
    if (room.isActive === false) {
      throw new BadRequestException();
    }
    try {
      socket.join(roomId);
      this.server.to(roomId).emit("rooms/joined", { userId });
    } catch (error) {
      socket.emit("error", {
        message: "Failed to join room",
        detail: error.message,
      });
    }
  }

  @SubscribeMessage("rooms/leave")
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    const userId = (socket as any).user;
    socket.leave(roomId);
    this.server.to(roomId).emit("rooms/left", { userId: userId });
  }

  //TODO: add host guard
  @SubscribeMessage("rooms/archive")
  async handleArchiveRoom(@MessageBody() data: { roomId: string }) {
    const { roomId } = data;
    const room = await this.roomsService.updateRoom(roomId, { isActive: false });
    this.server.to(roomId).emit("rooms/archived", { roomId });
  }

  //TODO: add host guard
  @SubscribeMessage("rooms/remove")
  async handleRemoveUser(@MessageBody() data: { roomId: string; userId: string }) {
    const { roomId, userId } = data;
    const user = await this.roomsService.leaveRoom(userId, roomId);
    this.server.to(roomId).emit("rooms/removed", { userId });
  }

  @SubscribeMessage("rooms/leaveP")
  async handleleaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    const userId = (socket as any).user;
    const user = await this.roomsService.leaveRoom(userId, roomId);
    this.server.to(roomId).emit("rooms/leftP", { userId });
  }
}
