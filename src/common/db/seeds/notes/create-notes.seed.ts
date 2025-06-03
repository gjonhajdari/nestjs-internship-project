import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { DeepPartial, In } from "typeorm";
import { Note } from "../../../../api/notes/entities/note.entity";
import { Room } from "../../../../api/rooms/entities/room.entity";
import { User } from "../../../../api/user/entities/user.entity";
import AppDataSource from "../../dataSource/data-source.initialize";

@Injectable()
export class NotesSeeder implements Seeder {
  async seed(): Promise<any> {
    const notesRepository = AppDataSource.getRepository(Note);
    const roomsRepository = AppDataSource.getRepository(Room);
    const usersRepository = AppDataSource.getRepository(User);

    const notes = notesRepository.create([
      {
        content:
          "Explore new ways to onboard users with interactive product tours or gamification elements.",
        totalVotes: 0,
        color: "note-background-red",
        xAxis: 100,
        yAxis: 200,
      },
      {
        content:
          "Explore ideas for making our product more accessible and inclusive to a global audience.",
        totalVotes: 0,
        color: "note-background-pink",
        xAxis: 300,
        yAxis: 400,
      },
      {
        content:
          "Research competitors approach to user retention and identify gaps in our current strategy.",
        totalVotes: 0,
        color: "note-background-yellow",
        xAxis: 500,
        yAxis: 600,
      },
    ] as DeepPartial<Note>[]);

    const user = await usersRepository.findOne({ where: { id: 1 } });
    const room = await roomsRepository.findOne({ where: { id: 1 } });

    for (const note of notes) {
      note.room = room;
      note.author = user;
    }

    await notesRepository.save(notes);
  }

  async drop(): Promise<any> {
    const notesRepository = AppDataSource.getRepository(Note);

    const ids = [1, 2, 3];

    await notesRepository.delete({ id: In(ids) });
  }
}
