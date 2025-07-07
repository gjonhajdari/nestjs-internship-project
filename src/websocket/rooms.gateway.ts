import { UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { plainToInstance } from "class-transformer";
import { Socket } from "socket.io";
import { UpdateRoomDto } from "src/api/rooms/dtos/update-room.dto";
import { Room } from "src/api/rooms/entities/room.entity";
import { ActivitiesService } from "../api/activities/activities.service";
import { RoomRoles } from "../api/rooms/enums/room-roles.enum";
import { RoomsService } from "../api/rooms/rooms.service";
import { Roles } from "../common/decorators/roles.decorator";
import { WsRolesGuard } from "../common/ws-guards/ws-roles.guard";
import { BaseWebsocketGateway } from "./base-websocket.gateway";

@WebSocketGateway()
export class RoomsGateway extends BaseWebsocketGateway {
  constructor(
    private roomsService: RoomsService,
    private activitiesService: ActivitiesService,
  ) {
    super();
  }

  @UseGuards(WsRolesGuard)
  @SubscribeMessage("rooms/join")
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    const userId = (socket as any).user;
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

  @UseGuards(WsRolesGuard)
  @Roles(RoomRoles.HOST)
  @SubscribeMessage("rooms/update")
  async handleEditRoom(
    @MessageBody() data: { roomId: string; payload: UpdateRoomDto },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, payload } = data;
    try {
      const room = await this.roomsService.updateRoom(roomId, payload);
      this.server.to(roomId).emit("rooms/updated", plainToInstance(Room, room));
    } catch (error) {
      socket.emit("error", error.message);
    }
  }

  @UseGuards(WsRolesGuard)
  @Roles(RoomRoles.HOST)
  @SubscribeMessage("rooms/delete")
  async handleDeleteRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    try {
      const deleted = await this.roomsService.deleteRoom(roomId);
      this.server.to(roomId).emit("rooms/deleted", deleted);
    } catch (error) {
      socket.emit("error", error.message);
    }
  }

  @UseGuards(WsRolesGuard)
  @Roles(RoomRoles.HOST)
  @SubscribeMessage("rooms/remove")
  async handleRemoveUser(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, userId } = data;
    try {
      //const user = await this.roomsService.leaveRoom(userId, roomId);
      this.server.to(roomId).emit("rooms/removed", { userId });
    } catch (error) {
      socket.emit("error", error.message);
    }
  }

  @SubscribeMessage("rooms/leaveP")
  async handleLeaveRoomP(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    const userId = (socket as any).user;
    try {
      //const user = await this.roomsService.leaveRoom(userId, roomId);
      this.server.to(roomId).emit("rooms/leftP", { userId });
    } catch (error) {
      socket.emit("error", error.message);
    }
  }
}
