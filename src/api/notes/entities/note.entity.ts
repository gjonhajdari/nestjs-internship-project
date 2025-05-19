import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Check, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AuditEntity } from "../../../common/db/customBaseEntites/AuditEntity";
import { Comment } from "../../comments/entities/comment.entity";
import { Room } from "../../rooms/entities/room.entity";
import { User } from "../../user/entities/user.entity";

@Entity("notes")
@Index("idx_notes_room_id", ["room"])
export class Note extends AuditEntity {
  @ManyToOne(
    () => Room,
    (room) => room.notes,
  )
  @JoinColumn({ name: "room_id" })
  @ApiProperty({
    type: () => Room,
    description: "Room that the note is in",
  })
  room: Room;

  @ManyToOne(
    () => User,
    (user) => user.notes,
  )
  @JoinColumn({ name: "author_id" })
  @ApiProperty({
    type: () => User,
    description: "User that created the note",
  })
  author: User;

  @Column({ type: "text", nullable: true })
  @ApiPropertyOptional({
    type: String,
    description: "Note contents",
    example: "This is a sample note content",
  })
  content?: string;

  @Column({ name: "total_votes", type: "int", nullable: false, default: 0 })
  @Check('"total_votes" >= 0')
  @ApiProperty({
    type: Number,
    description: "Number of votes on the note",
    example: 5,
  })
  totalVotes: number;

  @Column({ name: "x_axis", type: "int", nullable: false, default: 0 })
  @Check(`"x_axis" >= 0 AND "x_axis" <= 50000`)
  @ApiProperty({
    type: Number,
    description: "The X coordinate for the note on the display. It should be an integer.",
    example: 1000,
  })
  xAxis: number;

  @Column({ name: "y_axis", type: "int", nullable: false, default: 0 })
  @Check(`"y_axis" >= 0 AND "y_axis" <= 50000`)
  @ApiProperty({
    type: Number,
    description: "The Y coordinate for the note on the display. It should be an integer.",
    example: 2500,
  })
  yAxis: number;

  @OneToMany(
    () => Comment,
    (comment) => comment.note,
  )
  comments: Comment[];
}
