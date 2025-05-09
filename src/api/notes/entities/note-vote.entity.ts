import { ApiProperty } from "@nestjs/swagger";
import { Note } from "src/api/notes/entities/note.entity";
import { Room } from "src/api/rooms/entities/room.entity";
import { User } from "src/api/user/entities/user.entity";
import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

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
