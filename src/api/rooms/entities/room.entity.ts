import { Note } from "src/api/notes/entities/note.entity";
import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { slug } from "src/utils/slug";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { RoomUsers } from "./room-users.entity";

@Entity("rooms")
export class Room extends AuditEntity {
  @Column({ type: "varchar", length: 100, nullable: false })
  title: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug: string;

  @Column({ name: "is_active", type: "boolean", nullable: false, default: true })
  isActive: boolean;

  @OneToMany(
    () => RoomUsers,
    (roomUsers) => roomUsers.room,
  )
  users: RoomUsers[];

  @OneToMany(
    () => Note,
    (note) => note.room,
  )
  notes: Note[];

  @BeforeInsert()
  generateSlug() {
    this.slug = slug(this.title);
  }
}
