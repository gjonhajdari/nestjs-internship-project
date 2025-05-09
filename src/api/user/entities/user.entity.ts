import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Matches } from "class-validator";
import { Comment } from "src/api/comments/entities/comment.entity";
import { Note } from "src/api/notes/entities/note.entity";
import { RoomUsers } from "src/api/rooms/entities/room-users.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { AuditEntity } from "../../../common/db/customBaseEntites/AuditEntity";

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
    name: "hashed_reset_token",
  })
  @Exclude()
  hashedRefreshToken: string;

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
}
