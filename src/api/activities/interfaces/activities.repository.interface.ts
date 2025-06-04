import { IBaseCustomRepository } from "../../../common/db/customBaseRepository/interfaces/BaseCustomRepository.interface";
import { Activity } from "../entities/activity.entity";

export interface IActivitiesRepository extends IBaseCustomRepository<Activity> {}
