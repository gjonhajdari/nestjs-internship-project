import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { CreateRoomDto } from "../dtos/create-room.dto";
import { UpdateRoomDto } from "../dtos/update-room.dto";
import { RoomUsers } from "../entities/room-users.entity";
import { Room } from "../entities/room.entity";
import { RoomRoles } from "../enums/room-roles.enum";

export interface IRoomsService {
  findById(roomId: string): Promise<Room>;

  findRooms(userId: string, isActive: boolean): Promise<{ room: Room; role: RoomRoles }[]>;

  createRoom(payload: CreateRoomDto, userId: string): Promise<Room>;

  updateRoom(roomId: string, payload: UpdateRoomDto): Promise<Room>;

  deleteRoom(roomId: string): Promise<IResponseStatus>;

  joinRoom(userId: string, roomId: string): Promise<RoomUsers>;

  leaveRoom(userId: string, roomId: string): Promise<IResponseStatus>;
}
