import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateNoteDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    description: "UUID of the room where the note will be created.",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  roomId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: "Optional text content of the note.",
    example: "Remember to discuss this topic during the meeting.",
  })
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50000)
  @ApiPropertyOptional({
    type: Number,
    description: "X coordinate of the note (between 0 and 50,000).",
    example: 1200,
    minimum: 0,
    maximum: 50000,
    nullable: true,
  })
  xAxis?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50000)
  @ApiPropertyOptional({
    type: Number,
    description: "Y coordinate of the note (between 0 and 50,000).",
    example: 3400,
    minimum: 0,
    maximum: 50000,
    nullable: true,
  })
  yAxis?: number;
}
