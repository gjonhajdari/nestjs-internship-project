import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Matches } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { AuditEntity } from "../../../common/db/customBaseEntites/AuditEntity";
import { Activity } from "../../activities/entities/activity.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { NoteVote } from "../../notes/entities/note-vote.entity";
import { Note } from "../../notes/entities/note.entity";
import { RoomUsers } from "../../rooms/entities/room-users.entity";

@Entity("users")
export class User extends AuditEntity {
  // @Column({
  //   type: "enum",
  //   default: UserRoles.USER,
  //   enum: UserRoles,
  // })
  // role: UserRoles;

  // @Column({ default: false })
  // isRoleOverridden: boolean;

  // @Column({ type: "integer", default: 1 })
  // permissions: number;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    name: "first_name",
  })
  @ApiProperty({
    type: String,
    description: "Users's first name",
    example: "John",
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    name: "last_name",
  })
  @ApiProperty({
    type: String,
    description: "User's last name",
    example: "Doe",
  })
  lastName: string;

  @Column({
    type: "varchar",
    length: 320,
    unique: true,
    nullable: false,
  })
  @Matches(/^[a-zA-Z0–9._%+-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Please use a valid email address",
  })
  @ApiProperty({
    type: String,
    description: "User's email address",
    example: "johndoe@email.com",
  })
  email: string;

  @Column({
    type: "varchar",
    length: 128,
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: "varchar",
    length: 128,
    nullable: true,
    name: "hashed_refresh_token",
  })
  @Exclude()
  hashedRefreshToken: string;

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
    name: "is_verified",
  })
  isVerified: boolean;

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
    (roomUsers) => roomUsers.user,
  )
  rooms: RoomUsers[];

  @OneToMany(
    () => NoteVote,
    (noteVote) => noteVote.user,
  )
  noteVotes: NoteVote[];

  @OneToMany(
    () => Activity,
    (activity) => activity.user,
  )
  activities: Activity;
}
