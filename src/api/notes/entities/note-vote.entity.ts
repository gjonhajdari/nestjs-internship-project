import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Room } from "../../rooms/entities/room.entity";
import { User } from "../../user/entities/user.entity";
import { Note } from "../entities/note.entity";

@Entity("note_votes")
@Unique(["user", "room"])
export class NoteVote {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @ManyToOne(
    () => User,
    (user) => user.noteVotes,
  )
  @JoinColumn({ name: "user_id" })
  @ApiProperty({
    type: () => User,
    description: "The user who cast the vote. Each user can vote only once per room.",
    required: true,
  })
  user: User;

  @ManyToOne(
    () => Note,
    (note) => note.noteVotes,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "note_id" })
  @ApiProperty({
    type: () => Note,
    description: "The note that received the vote.",
    required: true,
  })
  note: Note;

  @ManyToOne(
    () => Room,
    (room) => room.noteVotes,
  )
  @JoinColumn({ name: "room_id" })
  @ApiProperty({
    type: () => Room,
    description:
      "The room where the note exists. Used to restrict a user to one vote per room.",
    required: true,
  })
  room: Room;
}
