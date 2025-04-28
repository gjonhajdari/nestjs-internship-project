import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    type: String,
    description: "Title of rooom",
    maxLength: 100,
    example: "Project ideas",
  })
  title: string;
}
