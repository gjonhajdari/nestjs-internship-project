import { BaseCustomRepository } from "../../../common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "../../../common/db/decorators/CustomRepository.decorator";
import { Activity } from "../entities/activity.entity";
import { IActivitiesRepository } from "../interfaces/activities.repository.interface";

@CustomRepository(Activity)
export class ActivitiesRepository
  extends BaseCustomRepository<Activity>
  implements IActivitiesRepository {}
