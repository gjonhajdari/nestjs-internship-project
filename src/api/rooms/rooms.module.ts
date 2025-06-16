import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { jwtConstants } from "../auth/constants/constants";
import { UserModule } from "../user/users.module";
import { RoomUsersRepository } from "./repository/room-users.repository";
import { RoomsRepository } from "./repository/rooms.repository";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([RoomsRepository, RoomUsersRepository]),
    forwardRef(() => UserModule),
    JwtModule.register({ secret: jwtConstants.invite_code_secret }),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
