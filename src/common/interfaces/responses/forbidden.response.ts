import { ApiProperty } from "@nestjs/swagger";

export class ForbiddenResponse {
  @ApiProperty({
    type: Number,
    description: "HTTP status code",
    example: 403,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: "HTTP method error",
    example: "Forbidden",
  })
  error: string;

  @ApiProperty({
    type: String,
    description: "Error description",
    example: "Forbidden resource",
  })
  message: string;
}
