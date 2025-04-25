import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateNoteDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: "string",
    description: "A unique identifier for the room entity. This should be a valid UUID.",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  roomId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: "string",
    description: "The content of the note. It should be a string with the note details.",
    example: "This is a sample note content",
    minLength: 0,
    nullable: false,
  })
  content: string;

  //TODO: delete this
  @IsNotEmpty()
  @IsInt()
  totalVotes: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    type: "number",
    description: "The X coordinate for the note on the display. It should be an integer.",
    example: 100,
    minimum: 0,
    maximum: 50000,
    nullable: false,
  })
  xAxis: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    type: "number",
    description: "The Y coordinate for the note on the display. It should be an integer.",
    example: 200,
    minimum: 0,
    maximum: 50000,
    nullable: false,
  })
  yAxis: number;
}
