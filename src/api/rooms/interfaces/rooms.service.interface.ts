import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { CreateRoomDto } from "../dtos/create-room.dto";
import { UpdateRoomDto } from "../dtos/update-room.dto";
import { RoomUsers } from "../entities/room-users.entity";
import { Room } from "../entities/room.entity";
import { Roles } from "../enums/roles.enum";

export interface IRoomsService {
  findById(roomId: string): Promise<Room>;

  findRooms(userId: string): Promise<{ room: Room; role: Roles }[]>;

  createRoom(payload: CreateRoomDto, userId: string): Promise<Room>;

  updateRoom(roomId: string, payload: UpdateRoomDto): Promise<Room>;

  deleteRoom(roomId: string): Promise<IDeleteStatus>;

  joinRoom(userId: string, roomId: string): Promise<RoomUsers>;

  leaveRoom(userId: string, roomId: string): Promise<boolean>;

  removeFromRoom(userId: string, roomId: string): Promise<boolean>;
}
