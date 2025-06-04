import { ApiProperty } from "@nestjs/swagger";
import { Room } from "src/api/rooms/entities/room.entity";
import { User } from "src/api/user/entities/user.entity";
import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { ResourceType } from "src/common/enums/resource-type.enum";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ActivityType } from "../../../common/enums/activity-type.enum";

@Entity("activities")
export class Activity extends AuditEntity {
  @Column({
    name: "activity_type",
    type: "enum",
    enum: ActivityType,
    nullable: false,
  })
  @ApiProperty({
    type: "enum",
    enum: ActivityType,
    description: "The activity type performed on the resource",
    example: "create",
  })
  activityType: ActivityType;

  @Column({
    name: "resource_type",
    type: "enum",
    enum: ResourceType,
    nullable: false,
  })
  @ApiProperty({
    type: "enum",
    enum: ResourceType,
    description: "The resource type affected",
    example: "note",
  })
  resourceType: ResourceType;

  @ManyToOne(
    () => User,
    (user) => user.activities,
    { nullable: false },
  )
  @JoinColumn()
  @ApiProperty({
    type: () => User,
    description: "The user that performed the activity",
  })
  user: User;

  @ManyToOne(
    () => Room,
    (room) => room.activities,
    { nullable: false },
  )
  @JoinColumn()
  @ApiProperty({
    type: () => Room,
    description: "The room where activity is performed",
  })
  room: Room;
}
