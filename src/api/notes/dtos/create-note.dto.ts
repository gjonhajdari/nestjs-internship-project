import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator";
import { NoteColor } from "../enums/note-color.enum";

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
  @IsEnum(NoteColor)
  @ApiPropertyOptional({
    enum: NoteColor,
    description: "Color of the note.",
    default: NoteColor.GREEN,
  })
  color?: NoteColor.GREEN;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5000)
  @ApiPropertyOptional({
    type: Number,
    description: "X coordinate of the note (between 0 and 5000).",
    example: 1200,
    minimum: 0,
    maximum: 5000,
    nullable: true,
  })
  xAxis?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5000)
  @ApiPropertyOptional({
    type: Number,
    description: "Y coordinate of the note (between 0 and 5000).",
    example: 3400,
    minimum: 0,
    maximum: 5000,
    nullable: true,
  })
  yAxis?: number;
}
