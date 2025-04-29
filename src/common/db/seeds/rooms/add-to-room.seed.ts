import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { RoomUsers } from "src/api/rooms/entities/room-users.entity";
import { Room } from "src/api/rooms/entities/room.entity";
import { Roles } from "src/api/rooms/enums/roles.enum";
import { User } from "src/api/user/entities/user.entity";
import { In } from "typeorm";
import AppDataSource from "../../dataSource/data-source.initialize";

@Injectable()
export class AddToRoomSeeder implements Seeder {
  async seed(): Promise<any> {
    const roomsRepository = AppDataSource.getRepository(Room);
    const usersRepository = AppDataSource.getRepository(User);
    const roomUsersRepository = AppDataSource.getRepository(RoomUsers);

    const emails = [
      "argjend@kutia.net",
      "blend@kutia.net",
      "lendrit@kutia.net",
      "leutrim@kutia.net",
    ];
    const slugs = ["test-1", "test-2", "test-3", "test-4"];

    const rooms = await roomsRepository.find({ where: { slug: In(slugs) } });
    const users = await usersRepository.find({ where: { email: In(emails) } });
    const roomUsers: RoomUsers[] = [];

    for (const room of rooms) {
      for (const user of users) {
        let ru: RoomUsers;

        if (user.id === 1) ru = roomUsersRepository.create({ role: Roles.HOST });
        else ru = roomUsersRepository.create({ role: Roles.PARTICIPANT });

        ru.user = user;
        ru.room = room;

        roomUsers.push(ru);
      }
    }

    await roomUsersRepository.save(roomUsers);
  }

  async drop(): Promise<any> {
    const roomsRepository = AppDataSource.getRepository(Room);
    const roomUsersRepository = AppDataSource.getRepository(RoomUsers);

    const slugs = ["test-1", "test-2", "test-3", "test-4"];
    const rooms = await roomsRepository.find({ where: { slug: In(slugs) } });

    await roomUsersRepository.delete({ room: In(rooms) });
  }
}
