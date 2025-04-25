import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  noteId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  content: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
