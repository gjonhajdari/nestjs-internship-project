import { ActivityType } from "src/common/enums/activity-type.enum";
import { ResourceType } from "src/common/enums/resource-type.enum";
import { Activity } from "../entities/activity.entity";

export interface IActivitiesService {
  findById(activityId: string): Promise<Activity>;
  findActivities(roomId: string): Promise<Activity[]>;
  createActivity(
    roomId: string,
    userId: string,
    activityType: ActivityType,
    resourceType: ResourceType,
  ): Promise<Activity>;
  deleteActivities(roomId: string): Promise<boolean>;
}
