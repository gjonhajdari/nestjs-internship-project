import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { RoomUsers } from "../../api/rooms/entities/room-users.entity";
import { RoomRoles } from "../../api/rooms/enums/room-roles.enum";
import { RoomsService } from "../../api/rooms/rooms.service";

@Injectable()
export class WsRolesGuard implements CanActivate {
  protected readonly reflector: Reflector = new Reflector();

  constructor(
    private moduleRef: ModuleRef,
    private roomsService: RoomsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const data = context.switchToWs().getData(); // Get the message body (e.g., { roomId: 'some-uuid' })
    const { id: userId } = (client as any).user;

    const roomId = data.roomId;
    const requiredRoles = this.reflector.get<RoomRoles[]>("roles", context.getHandler());

    if (!roomId && !requiredRoles) {
      return true;
    }

    if (requiredRoles && !roomId) {
      throw new ForbiddenException("Room ID is required for role-based access.");
    }

    let roomUser: RoomUsers | null;

    try {
      roomUser = await this.roomsService.getUserRole(roomId, userId);
    } catch (error) {
      throw new WsException(error.message);
    }

    if (!roomUser) {
      throw new ForbiddenException(
        "You don't have access to this room, or your role is not defined.",
      );
    }
    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.includes(roomUser.role);
  }
}
