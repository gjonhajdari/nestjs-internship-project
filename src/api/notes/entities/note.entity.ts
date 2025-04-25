import { Comment } from "src/api/comments/entities/comment.entity";
import { Room } from "src/api/rooms/entities/room.entity";
import { User } from "src/api/user/entities/user.entity";
import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: "notes" })
export class Note extends AuditEntity {
  @ManyToOne(
    () => User,
    (user) => user.notes,
  )
  @JoinColumn({ name: "author_id" })
  authorId: User;

  room_id;
  @ManyToOne(
    () => Room,
    (room) => room.notes,
  )
  @JoinColumn({ name: "room_id" })
  room: Room;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ type: "int", nullable: false })
  totalVotes: number;

  @Column({ type: "int", nullable: false })
  xAxis: number;

  @Column({ type: "int", nullable: false })
  yAxis: number;

  @OneToMany(
    () => Comment,
    (comment) => comment.note,
  )
  comments: Comment[];
}
