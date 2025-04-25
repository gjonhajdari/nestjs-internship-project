import { Module } from "@nestjs/common";
import { CustomRepositoryModule } from "src/common/db/CustomRepository.module";
import { RoomsRepository } from "./repository/rooms.repository";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([RoomsRepository])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
