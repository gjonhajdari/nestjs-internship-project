import { Module } from "@nestjs/common";
import { CustomRepositoryModule } from "src/common/db/CustomRepository.module";
import { UserModule } from "../user/users.module";
import { RoomUsersRepository } from "./repository/room-users.repository";
import { RoomsRepository } from "./repository/rooms.repository";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";

@Module({
  imports: [
    UserModule,
    CustomRepositoryModule.forCustomRepository([RoomsRepository, RoomUsersRepository]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
