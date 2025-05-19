import { ApiProperty } from "@nestjs/swagger";
import { ResourceType } from "../../types/ResourceType";
import { IDeleteStatus } from "../DeleteStatus.interface";

export class DeletedResponse implements IDeleteStatus {
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

  @ApiProperty({
    type: String,
    description: "The type of resource that was deleted",
    example: "note",
  })
  resourceType: ResourceType;

  @ApiProperty({
    type: String,
    description: "The unique identifier of the deleted resource",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  resourceId?: string;

  @ApiProperty({
    type: Date,
    description: "Timestamp of when the deletion occurred",
    example: "2023-10-01T12:00:00Z",
  })
  timestamp?: Date;
}
