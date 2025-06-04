import { ResourceType } from "../types/ResourceType";

export interface IResponseStatus {
  success: boolean;
  message: string;
  resourceType?: ResourceType;
  resourceId?: string;
  timestamp?: Date;
}
