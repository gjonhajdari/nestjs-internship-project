import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AuditEntity } from "../../../common/db/customBaseEntites/AuditEntity";
import { Note } from "../../notes/entities/note.entity";
import { User } from "../../user/entities/user.entity";

@Entity("comments")
export class Comment extends AuditEntity {
  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  @ApiProperty({
    type: String,
    description: "Comment contents",
    example: "This is a comment about the importance of writing.",
  })
  content: string;

  @ManyToOne(
    () => User,
    (user) => user.comments,
    { nullable: false },
  )
  @ApiProperty({
    type: () => User,
    description: "User who added the comment",
  })
  user: User;

  @ManyToOne(
    () => Note,
    (note) => note.comments,
    { nullable: false },
  )
  @ApiProperty({
    type: () => Note,
    description: "Note in which the comment is added to",
  })
  note: Note;

  @ManyToOne(
    () => Comment,
    (comment) => comment.id,
  )
  @JoinColumn({ name: "parent_id" })
  @ApiPropertyOptional({
    type: () => Comment,
    description: "Previous comment that the current comment is replying to",
  })
  parent: Comment;
}
