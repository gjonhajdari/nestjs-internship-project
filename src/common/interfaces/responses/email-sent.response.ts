import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IResponseStatus } from "../ResponseStatus.interface";

export class EmailSentResponse implements IResponseStatus {
  @ApiProperty({
    type: Boolean,
    description: "Indicates if the request was successful",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: String,
    description: "Message indicating the status of the email",
    example: "Email sent successfully",
  })
  message: string;

  @ApiPropertyOptional({
    type: Date,
    description: "Timestamp of when the email was sent",
    example: "2023-10-01T12:00:00Z",
  })
  timestamp?: Date;
}
