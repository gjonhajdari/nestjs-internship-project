import { ApiProperty } from "@nestjs/swagger";
import { Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { AuditEntity } from "../../../common/db/customBaseEntites/AuditEntity";
import { Room } from "../../rooms/entities/room.entity";
import { User } from "../../user/entities/user.entity";
import { Note } from "../entities/note.entity";

@Entity("note_votes")
@Unique(["user", "room"])
export class NoteVote extends AuditEntity {
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "user_id" })
  @ApiProperty({
    type: () => User,
    description: "The user who cast the vote. Each user can vote only once per room.",
    required: true,
  })
  user: User;

  @ManyToOne(() => Note, { eager: true })
  @JoinColumn({ name: "note_id" })
  @ApiProperty({
    type: () => Note,
    description: "The note that received the vote.",
    required: true,
  })
  note: Note;

  @ManyToOne(() => Room, { eager: true })
  @JoinColumn({ name: "room_id" })
  @ApiProperty({
    type: () => Room,
    description:
      "The room where the note exists. Used to restrict a user to one vote per room.",
    required: true,
  })
  room: Room;
}
