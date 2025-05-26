import { Module, forwardRef } from "@nestjs/common";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
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
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
