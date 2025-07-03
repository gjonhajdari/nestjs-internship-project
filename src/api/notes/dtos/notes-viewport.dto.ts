import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";

export class NotesViewportDto {
  @ApiProperty({
    description: "Minimum X coordinate of the viewport (left boundary)",
    example: 20,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  xMin: number;

  @ApiProperty({
    description: "Minimum Y coordinate of the viewport (top boundary)",
    example: 50,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  yMin: number;

  @ApiProperty({
    description: "Maximum X coordinate of the viewport (right boundary)",
    example: 700,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @Max(5000)
  xMax: number;

  @ApiProperty({
    description: "Maximum Y coordinate of the viewport (bottom boundary)",
    example: 1000,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @Max(2800)
  yMax: number;
}
