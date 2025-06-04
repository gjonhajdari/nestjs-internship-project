import { Module } from "@nestjs/common";
import { CustomRepositoryModule } from "src/common/db/CustomRepository.module";
import { RoomsModule } from "../rooms/rooms.module";
import { UserModule } from "../user/users.module";
import { ActivitiesController } from "./activities.controller";
import { ActivitiesService } from "./activities.service";
import { ActivitiesRepository } from "./repository/activities.repository";

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([ActivitiesRepository]),
    UserModule,
    RoomsModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
