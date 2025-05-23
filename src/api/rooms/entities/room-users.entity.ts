import { Exclude } from "class-transformer";
import { User } from "src/api/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { RoomRoles } from "../enums/room-roles.enum";
import { Room } from "./room.entity";

@Entity("room_users")
@Unique(["roomId", "userId"])
export class RoomUsers {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ name: "room_id", type: "integer" })
  roomId: number;

  @Column({ name: "user_id", type: "integer" })
  userId: number;

  @Column({ type: "enum", enum: RoomRoles, default: RoomRoles.PARTICIPANT, nullable: false })
  role: RoomRoles;

  @CreateDateColumn()
  joined_at: Date;

  @ManyToOne(
    () => Room,
    (room) => room.users,
  )
  @JoinColumn({ name: "room_id", referencedColumnName: "id" })
  room: Room;

  @ManyToOne(
    () => User,
    (user) => user.rooms,
  )
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
