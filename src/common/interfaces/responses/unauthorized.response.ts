import { ApiProperty } from "@nestjs/swagger";
import { IApiResponse } from "../ApiResponse.interface";

export class UnauthorizedResponse implements IApiResponse {
  @ApiProperty({
    type: Number,
    description: "HTTP status code",
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: "HTTP method error",
    example: "Unauthorized",
  })
  error: string;
}
