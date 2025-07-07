import { UpdateRoomDto } from "src/api/rooms/dtos/update-room.dto";
import { Room } from "src/api/rooms/entities/room.entity";
import { IResponseStatus } from "../../common/interfaces/ResponseStatus.interface";

export interface RoomsListenEvents {
  "rooms/join": (data: { roomId: string }) => void;
  "rooms/leave": (data: { roomId: string }) => void;
  "rooms/update": (data: { roomId: string; payload: UpdateRoomDto }) => void;
  "rooms/remove": (data: { roomId: string; userId: string }) => void;
  "rooms/leaveP": (data: { roomId: string }) => void;
  "rooms/delete": (data: { roomId: string }) => void;
}

export interface RoomsEmitEvents {
  "rooms/joined": (data: { userId: string }) => void;
  "rooms/left": (data: { userId: string }) => void;
  "rooms/updated": (data: Room) => void;
  "rooms/removed": (data: { userId: string }) => void;
  "rooms/leftP": (data: { userId: string }) => void;
  "rooms/deleted": (data: IResponseStatus) => void;
}
