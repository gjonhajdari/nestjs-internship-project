import { ResourceType } from "../enums/resource-type.enum";

export interface IDeleteStatus {
  success: boolean;
  message: string;
  resourceType: ResourceType;
  resourceId?: string;
  timestamp?: Date;
}
