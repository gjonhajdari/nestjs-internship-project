import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { In } from "typeorm";
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
        content: "test",
        totalVotes: 123,
        xAxis: 1000,
        yAxis: 2000,
      },
      {
        content: "test-2",
        totalVotes: 123,
        xAxis: 1000,
        yAxis: 2000,
      },
      {
        content: "test-3",
        totalVotes: 123,
        xAxis: 1000,
        yAxis: 2000,
      },
    ]);

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
