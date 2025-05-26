import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { In } from "typeorm";
import { Room } from "../../../../api/rooms/entities/room.entity";
import AppDataSource from "../../dataSource/data-source.initialize";

@Injectable()
export class RoomsSeeder implements Seeder {
  async seed(): Promise<any> {
    const roomsRepository = AppDataSource.getRepository(Room);

    const rooms = roomsRepository.create([
      { title: "test-1", slug: "test-1" },
      { title: "test-2", slug: "test-2" },
      { title: "test-3", slug: "test-3" },
      { title: "test-4", slug: "test-4" },
    ]);

    await roomsRepository.save(rooms);
  }

  async drop(): Promise<any> {
    const roomsRepository = AppDataSource.getRepository(Room);

    const slugs = ["test-1", "test-2", "test-3", "test-4"];

    await roomsRepository.delete({ slug: In(slugs) });
  }
}
