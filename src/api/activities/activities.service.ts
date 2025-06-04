import { tryCatch } from "@maxmorozoff/try-catch-tuple";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ActivityType } from "../../common/enums/activity-type.enum";
import { ResourceType } from "../../common/enums/resource-type.enum";
import { RoomsService } from "../rooms/rooms.service";
import { UsersService } from "../user/users.service";
import { Activity } from "./entities/activity.entity";
import { IActivitiesService } from "./interfaces/activities.service.interface";
import { ActivitiesRepository } from "./repository/activities.repository";

@Injectable()
export class ActivitiesService implements IActivitiesService {
  constructor(
    private activitiesRepository: ActivitiesRepository,
    private usersService: UsersService,
    private roomsService: RoomsService,
  ) {}

  /**
   * Finds activity by its UUID
   *
   * @param activityId - the UUID of the activity to find
   * @returns Promise that resolves to activity if found
   * @throws {NotFoundException} - If the activity doesn't exist
   * @throws {InternalServerErrorException} - If there was an error processing the request
   */
  async findById(activityId: string): Promise<Activity> {
    const [activity, error] = await tryCatch(
      this.activitiesRepository.findOne({ where: { uuid: activityId } }),
    );

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    if (!activity) throw new NotFoundException("Activity not found!");

    return activity;
  }

  /**
   * Finds activities for a specific room
   *
   * @param roomId - the UUID of the room to find activies for
   * @returns Promise that resolves to an array of activities
   * @throws {InternalServerErrorException} - If there was an error processing the request
   */
  async findActivities(roomId: string): Promise<Activity[]> {
    const [activities, error] = await tryCatch(
      this.activitiesRepository.find({
        where: { room: { uuid: roomId } },
        relations: ["room", "user"],
      }),
    );
    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return activities;
  }

  /**
   *
   * @param roomId - the UUID of the room where activity happened
   * @param userId - the UUID of the user that performed the activity
   * @param activityType - the type of activity performed
   * @param resourceType - the type of affected resource
   * @returns - Promise that resolves to an activity if created successfully
   * @throws {InternalServerErrorException} - if activity creation fails
   */
  async createActivity(
    roomId: string,
    userId: string,
    activityType: ActivityType,
    resourceType: ResourceType,
  ): Promise<Activity> {
    const user = await this.usersService.findOne(userId);
    const room = await this.roomsService.findById(roomId);

    const activity = this.activitiesRepository.create({
      room,
      user,
      activityType,
      resourceType,
    });
    const [newActivity, error] = await tryCatch(this.activitiesRepository.save(activity));
    if (error)
      throw new InternalServerErrorException("There was an error processing your request");
    return newActivity;
  }

  /**
   *
   * @param roomId - the UUID of the room of which to delete the activities
   * @returns true if deleted successfully
   * @throws {InternalServerErrorException} - if activity deletion failed
   */
  async deleteActivities(roomId: string): Promise<boolean> {
    const room = await this.roomsService.findById(roomId);
    const [_, error] = await tryCatch(
      this.activitiesRepository.delete({
        room,
      }),
    );

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");
    return true;
  }
}
