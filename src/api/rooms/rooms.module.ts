import { Module, forwardRef } from "@nestjs/common";
import { CustomRepositoryModule } from "src/common/db/CustomRepository.module";
import { UserModule } from "../user/users.module";
import { RoomUsersRepository } from "./repository/room-users.repository";
import { RoomsRepository } from "./repository/rooms.repository";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([RoomsRepository, RoomUsersRepository]),
    forwardRef(() => UserModule),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomUsersRepository],
  exports: [RoomsService, RoomUsersRepository],
})
export class RoomsModule {}
