import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateNoteDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  totalVotes: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  xAxis: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  yAxis: number;
}
