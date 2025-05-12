import { ApiProperty } from "@nestjs/swagger";
import { NoteVote } from "src/api/notes/entities/note-vote.entity";
import { Note } from "src/api/notes/entities/note.entity";
import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { slug } from "src/utils/slug";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { AuditEntity } from "../../../common/db/customBaseEntites/AuditEntity";
import { slug } from "../../../utils/slug";
import { Note } from "../../notes/entities/note.entity";
import { RoomUsers } from "./room-users.entity";

@Entity("rooms")
export class Room extends AuditEntity {
  @Column({ type: "varchar", length: 100, nullable: false })
  @ApiProperty({
    type: String,
    description: "Room's title",
    example: "Intership Project",
  })
  title: string;

  @Column({ type: "varchar", length: 255, unique: true })
  @ApiProperty({
    type: String,
    description: "Room's slug",
    example: "intership-project",
  })
  slug: string;

  @Column({ name: "is_active", type: "boolean", nullable: false, default: true })
  @ApiProperty({
    type: Boolean,
    description: "Is room active",
    example: "true",
  })
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

  @OneToMany(
    () => NoteVote,
    (vote) => vote.room,
  )
  noteVotes: NoteVote[];

  @BeforeInsert()
  generateSlug() {
    this.slug = slug(this.title);
  }
}
