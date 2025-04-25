import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    description: "UUID of the room in which the note is created",
    example: "1b87c96d-3240-4dbe-992f-36e56899b5fc",
  })
  noteId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @ApiProperty({
    type: String,
    description: "Note contents",
    maxLength: 150,
    example: "This is a note about the importance of writing.",
  })
  content: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    type: String,
    description: "UUID of the parent comment that the comment is replying to",
    example: "1354f59a-1a53-4979-9089-857912c4d06d",
    // nullable: true,
  })
  parentId?: string;
}
