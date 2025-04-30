import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Note } from "src/api/notes/entities/note.entity";
import { User } from "src/api/user/entities/user.entity";
import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

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
