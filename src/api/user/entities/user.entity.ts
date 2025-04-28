import { Exclude } from "class-transformer";
import { Comment } from "src/api/comments/entities/comment.entity";
import { Note } from "src/api/notes/entities/note.entity";
import { RoomUsers } from "src/api/rooms/entities/room-users.entity";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { AuditEntity } from "../../../common/db/customBaseEntites/AuditEntity";
import { UserRoles } from "../enums/roles.enum";

@Entity("users")
export class User extends AuditEntity {
  @Column({
    type: "enum",
    default: UserRoles.USER,
    enum: UserRoles,
  })
  role: UserRoles;

  @Column({ default: false })
  isRoleOverridden: boolean;

  @Column({ type: "integer", default: 1 })
  permissions: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  @Index()
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  hashedRt: string;

  @OneToMany(
    () => Note,
    (note) => note.author,
  )
  notes: Note[];

  @OneToMany(
    () => Comment,
    (comment) => comment.user,
  )
  comments: Comment[];

  @OneToMany(
    () => RoomUsers,
    (roomUsers) => roomUsers.userId,
  )
  rooms: RoomUsers[];
}
