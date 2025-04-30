import { ApiProperty } from "@nestjs/swagger";
import { IApiResponse } from "../ApiResponse.interface";

export class BadRequestResponse implements IApiResponse {
  @ApiProperty({
    type: Number,
    description: "HTTP status code",
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: "HTTP method error",
    example: "Bad Request",
  })
  error: string;

  @ApiProperty({
    type: String,
    description: "Error message",
    example: "Error processing request",
  })
  message: string;
}
