import { Comment } from "src/api/comments/entities/comment.entity";
import { Room } from "src/api/rooms/entities/room.entity";
import { User } from "src/api/user/entities/user.entity";
import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { Check, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity("notes")
@Index("idx_notes_room_id", ["room"])
export class Note extends AuditEntity {
  @ManyToOne(
    () => Room,
    (room) => room.notes,
  )
  @JoinColumn({ name: "room_id" })
  room: Room;

  @ManyToOne(
    () => User,
    (user) => user.notes,
  )
  @JoinColumn({ name: "author_id" })
  author: User;

  @Column({ type: "text", nullable: true })
  content?: string;

  @Column({ name: "total_votes", type: "int", nullable: false, default: 0 })
  @Check('"total_votes" >= 0')
  totalVotes: number;

  @Column({ name: "x_axis", type: "int", nullable: false, default: 0 })
  @Check(`"x_axis" >= 0 AND "x_axis" <= 50000`)
  xAxis: number;

  @Column({ name: "y_axis", type: "int", nullable: false, default: 0 })
  @Check(`"y_axis" >= 0 AND "y_axis" <= 50000`)
  yAxis: number;

  @OneToMany(
    () => Comment,
    (comment) => comment.note,
  )
  comments: Comment[];
}
