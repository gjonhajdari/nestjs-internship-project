//TODO: add activites controller interface

import { Activity } from "../entities/activity.entity";

export interface IActivitesController {
  findAll(roomId: string): Promise<Activity[]>;
}
