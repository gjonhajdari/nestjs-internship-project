import { ApiProperty } from "@nestjs/swagger";
import { IApiResponse } from "../ApiResponse.interface";

export class InternalErrorResponse implements IApiResponse {
  @ApiProperty({
    type: Number,
    description: "HTTP status code",
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: "HTTP method error",
    example: "Internal Server Error",
  })
  error: string;
}
