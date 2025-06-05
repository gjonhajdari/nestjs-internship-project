import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { RoomRoles } from "src/api/rooms/enums/room-roles.enum";
import { RoomUsersRepository } from "src/api/rooms/repository/room-users.repository";
import { RoomsService } from "src/api/rooms/rooms.service";

@Injectable()
export class RolesGuard implements CanActivate {
  protected readonly reflector: Reflector = new Reflector();
  private roomUsersRepository: RoomUsersRepository;

  constructor(
    private moduleRef: ModuleRef,
    private roomsService: RoomsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // await super.canActivate(context);
    if (!this.roomUsersRepository) {
      this.roomUsersRepository = this.moduleRef.get(RoomUsersRepository, { strict: false });
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    const roomId = request.params.roomId;
    const roles = this.reflector.get<RoomRoles[]>("roles", context.getHandler());

    if (!roomId && !roles) return true;

    const room = await this.roomsService.findById(roomId);

    const roomUser = await this.roomUsersRepository.findOne({
      where: {
        roomId: room.id,
        userId: user.id,
      },
    });

    if (!roomUser) throw new ForbiddenException("You don't have access to this room");
    if (!roles) return true;

    return roles.includes(roomUser.role);
  }
}
