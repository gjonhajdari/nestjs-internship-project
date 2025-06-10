import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUser } from "src/common/decorators/get-current-user.decorator";
import { User } from "../user/entities/user.entity";
import { ActivitiesService } from "./activities.service";
import { Activity } from "./entities/activity.entity";
import { IActivitesController } from "./interfaces/activities.controller.interface";

@ApiBearerAuth()
@ApiTags("Activities")
@UseInterceptors(ClassSerializerInterceptor)
@Controller("activities")
export class ActivitiesController implements IActivitesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Get(":roomId")
  async findAll(@Param("roomId", new ParseUUIDPipe()) roomId: string): Promise<Activity[]> {
    return this.activitiesService.findActivities(roomId);
  }

  @Post(":roomId")
  async create(
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
    @GetCurrentUser() user: User,
    @Body() body,
  ) {
    const { activityType, resourceType, resourceId } = body;
    return this.activitiesService.createActivity(
      roomId,
      user.uuid,
      activityType,
      resourceType,
      resourceId,
    );
  }

  @Delete(":roomId")
  async delete(@Param("roomId", new ParseUUIDPipe()) roomId: string) {
    return this.activitiesService.deleteActivities(roomId);
  }
}
