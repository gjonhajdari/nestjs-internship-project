import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { CreateRoomDto } from "../dtos/create-room.dto";
import { UpdateRoomDto } from "../dtos/update-room.dto";
import { RoomUsers } from "../entities/room-users.entity";
import { Room } from "../entities/room.entity";

export interface IRoomsController {
  findById(roomId: string): Promise<Room>;

  findRooms(): Promise<Room[]>;

  create(payload: CreateRoomDto, userID: string): Room;

  update(roomId: string, payload: UpdateRoomDto): Promise<Room>;

  delete(roomId: string): Promise<IDeleteStatus>;

  join(userId: string, roomId: string): Promise<RoomUsers>;

  leave(userId: string, roomId: string): Promise<boolean>;

  removeFromRoom(userId: string, roomId: string): Promise<boolean>;
}
