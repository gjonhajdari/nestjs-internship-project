import { Note } from "src/api/notes/entities/note.entity";
import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { Column, Entity, OneToMany } from "typeorm";
import { RoomUsers } from "./room-users.entity";

@Entity("rooms")
export class Room extends AuditEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: false, default: true })
  is_active: boolean;

  @OneToMany(
    () => RoomUsers,
    (roomUsers) => roomUsers.roomId,
  )
  users: RoomUsers[];

  @OneToMany(
    () => Note,
    (note) => note.room,
  )
  notes: Note[];
}
