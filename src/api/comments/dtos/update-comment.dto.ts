import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateCommentDto {
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
}
