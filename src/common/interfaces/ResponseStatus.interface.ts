import { ResourceType } from "../enums/resource-type.enum";

export interface IResponseStatus {
  success: boolean;
  message: string;
  resourceType?: ResourceType;
  resourceId?: string;
  timestamp?: Date;
}
