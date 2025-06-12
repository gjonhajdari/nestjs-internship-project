import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AuditEntity } from "../../../common/db/customBaseEntites/AuditEntity";
import { ActivityType } from "../../../common/enums/activity-type.enum";
import { ResourceType } from "../../../common/enums/resource-type.enum";
import { Room } from "../../rooms/entities/room.entity";
import { User } from "../../user/entities/user.entity";

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

  @Column({
    name: "resource_id",
    type: "uuid",
    nullable: false,
  })
  @ApiProperty({
    type: "uuid",
    description: "UUID of the affected resource",
  })
  resourceId: string;

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
