import { ApiProperty } from "@nestjs/swagger";
import { Room } from "src/api/rooms/entities/room.entity";
import { Roles } from "src/api/rooms/enums/roles.enum";

export class GetRoomsResponse {
  @ApiProperty({
    type: Room,
    description: "Room object",
  })
  room: Room;

  @ApiProperty({
    enum: Roles,
    description: "Users role in the corresponding room",
  })
  role: Roles;
}
