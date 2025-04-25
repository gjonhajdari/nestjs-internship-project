import { ResourceType } from "../types/ResourceType";

export interface IDeleteStatus {
  success: boolean;
  message: string;
  resourceType: ResourceType;
  resourceId?: string;
  timestamp?: Date;
}
