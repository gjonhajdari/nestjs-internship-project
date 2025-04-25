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
  content: string;

  @ManyToOne(
    () => User,
    (user) => user.comments,
    { nullable: false },
  )
  user: User;

  @ManyToOne(
    () => Note,
    (note) => note.comments,
    { nullable: false },
  )
  note: Note;

  @ManyToOne(
    () => Comment,
    (comment) => comment.id,
  )
  @JoinColumn({ name: "parent_id" })
  parent: Comment;
}
