import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateNoteDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    description: "A unique identifier for the room entity. This should be a valid UUID.",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  roomId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: "The content of the note. It can be long text.",
    example: "This is a sample note content",
    nullable: true,
  })
  content?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(50000)
  @ApiProperty({
    type: Number,
    description: "The X coordinate for the note on the display. It should be an integer.",
    example: 100,
    minimum: 0,
    maximum: 50000,
    nullable: false,
  })
  xAxis: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(50000)
  @ApiProperty({
    type: Number,
    description: "The Y coordinate for the note on the display. It should be an integer.",
    example: 200,
    minimum: 0,
    maximum: 50000,
    nullable: false,
  })
  yAxis: number;
}
