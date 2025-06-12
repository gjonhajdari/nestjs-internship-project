import { ApiProperty } from "@nestjs/swagger";
import { Room } from "../../../api/rooms/entities/room.entity";
import { RoomRoles } from "../../../api/rooms/enums/room-roles.enum";

export class GetRoomsResponse {
  @ApiProperty({
    type: Room,
    description: "Room object",
  })
  room: Room;

  @ApiProperty({
    enum: RoomRoles,
    description: "Users role in the corresponding room",
  })
  role: RoomRoles;
}
