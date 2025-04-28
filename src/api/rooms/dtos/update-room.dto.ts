import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateRoomDto } from "./create-room.dto";

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    type: Boolean,
    description: "Is room active",
    example: "true",
  })
  is_active: boolean;
}
