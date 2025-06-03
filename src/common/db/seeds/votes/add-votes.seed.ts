import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { NoteVote } from "../../../../api/notes/entities/note-vote.entity";
import { Note } from "../../../../api/notes/entities/note.entity";
import { Room } from "../../../../api/rooms/entities/room.entity";
import { User } from "../../../../api/user/entities/user.entity";
import AppDataSource from "../../dataSource/data-source.initialize";

@Injectable()
export class AddVotesSeeder implements Seeder {
  async seed(): Promise<any> {
    const userRepo = AppDataSource.getRepository(User);
    const noteRepo = AppDataSource.getRepository(Note);
    const roomRepo = AppDataSource.getRepository(Room);
    const voteRepo = AppDataSource.getRepository(NoteVote);

    const room = await roomRepo.findOne({ where: { id: 1 } });
    const users = await userRepo.find();

    const notes = await noteRepo.find({
      where: { room: { id: room.id } },
      relations: ["room"],
    });

    const votesToInsert: NoteVote[] = [];

    for (const user of users) {
      const note = notes[Math.floor(Math.random() * notes.length)];

      const vote = voteRepo.create({
        user,
        note,
        room,
      });

      votesToInsert.push(vote);

      note.totalVotes += 1;
      await noteRepo.save(note);
    }

    await voteRepo.save(votesToInsert);
  }

  async drop(): Promise<any> {
    const voteRepo = AppDataSource.getRepository(NoteVote);
    await voteRepo.clear();
  }
}
