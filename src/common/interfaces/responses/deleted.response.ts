import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ResourceType } from "../../types/ResourceType";
import { IResponseStatus } from "../ResponseStatus.interface";

export class DeletedResponse implements IResponseStatus {
  @ApiProperty({
    type: Boolean,
    description: "Indicates if the request was successful",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: String,
    description: "Message indicating the status of the deletion",
    example: "Resource deleted successfully",
  })
  message: string;

  @ApiPropertyOptional({
    type: String,
    description: "The type of resource that was deleted",
    example: "note",
  })
  resourceType?: ResourceType;

  @ApiPropertyOptional({
    type: String,
    description: "The unique identifier of the deleted resource",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  resourceId?: string;

  @ApiPropertyOptional({
    type: Date,
    description: "Timestamp of when the deletion occurred",
    example: "2023-10-01T12:00:00Z",
  })
  timestamp?: Date;
}
