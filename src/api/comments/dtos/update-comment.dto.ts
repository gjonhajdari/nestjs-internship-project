import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  noteId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  content: string;
}
