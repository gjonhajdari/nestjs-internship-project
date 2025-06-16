import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { ExportFileType } from "../enums/export-file-type.enum";

export class ExportNotesDto {
  @ApiProperty({
    description: "The UUID of the room from which notes are to be exported",
    type: String,
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @ApiProperty({
    description: "The format in which notes should be exported",
    enum: ExportFileType,
    example: ExportFileType.JSON,
  })
  @IsNotEmpty()
  @IsEnum(ExportFileType)
  fileType: ExportFileType;
}
