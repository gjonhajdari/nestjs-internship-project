import { IDeleteStatus } from "../../../common/interfaces/DeleteStatus.interface";
import { User } from "../../user/entities/user.entity";
import { CreateRoomDto } from "../dtos/create-room.dto";
import { UpdateRoomDto } from "../dtos/update-room.dto";
import { RoomUsers } from "../entities/room-users.entity";
import { Room } from "../entities/room.entity";
import { RoomRoles } from "../enums/room-roles.enum";

export interface IRoomsController {
  findById(roomId: string): Promise<Room>;

  findRooms(user: User): Promise<{ room: Room; role: RoomRoles }[]>;

  create(body: CreateRoomDto, user: User): Promise<Room>;

  update(roomId: string, body: UpdateRoomDto): Promise<Room>;

  delete(roomId: string): Promise<IDeleteStatus>;

  join(user: User, roomId: string): Promise<RoomUsers>;

  leave(user: User, roomId: string): Promise<IDeleteStatus>;

  removeFromRoom(userId: string, roomId: string): Promise<IDeleteStatus>;
}
