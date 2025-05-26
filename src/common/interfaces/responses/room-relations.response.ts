import { ApiProperty } from "@nestjs/swagger";
import { Room } from "../../../api/rooms/entities/room.entity";

class UserWithRole {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

class NoteMinimal {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  totalVotes: number;

  @ApiProperty()
  xAxis: number;

  @ApiProperty()
  yAxis: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class RoomRelationsResponse extends Room {
  @ApiProperty({ type: UserWithRole, isArray: true })
  user: UserWithRole[];

  @ApiProperty({ type: NoteMinimal, isArray: true })
  note: NoteMinimal[];
}
