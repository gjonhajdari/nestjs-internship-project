import { ApiProperty } from "@nestjs/swagger";
import { IApiResponse } from "../ApiResponse.interface";

export class UnprocessableEntityResponse implements IApiResponse {
  @ApiProperty({
    type: Number,
    description: "HTTP status code",
    example: 422,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: "HTTP method error",
    example: "Unprocessable Entity",
  })
  error: string;

  @ApiProperty({
    type: String,
    description: "Error description",
    example: "The request couldn't be processed due to semantic errors.",
  })
  message: string;
}
