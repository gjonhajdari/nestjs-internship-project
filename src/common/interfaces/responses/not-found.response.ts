import { ApiProperty } from "@nestjs/swagger";
import { IApiResponse } from "../ApiResponse.interface";

export class NotFoundResponse implements IApiResponse {
  @ApiProperty({
    type: Number,
    description: "HTTP status code",
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: "HTTP method error",
    example: "Not Found",
  })
  error: string;

  @ApiProperty({
    type: String,
    description: "Error description",
    example: "Resource not Found",
  })
  message: string;
}
