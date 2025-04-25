import { User } from "src/api/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Roles } from "../enums/roles.enum";
import { Room } from "./room.entity";

@Entity("room-users")
export class RoomUsers {
  @Column({ type: "enum", enum: Roles, nullable: false })
  role: Roles;

  @CreateDateColumn()
  joined_at: Date;

  @PrimaryColumn({ name: "room_id", type: "uuid" })
  @ManyToOne(
    () => Room,
    (room) => room.users,
  )
  @JoinColumn({ name: "room_id", referencedColumnName: "uuid" })
  roomId: Room;

  @PrimaryColumn({ name: "user_id", type: "uuid" })
  @ManyToOne(
    () => User,
    (user) => user.rooms,
  )
  @JoinColumn({ name: "user_id", referencedColumnName: "uuid" })
  userId: User;
}
