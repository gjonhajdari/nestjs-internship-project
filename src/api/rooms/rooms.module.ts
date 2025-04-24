import { Module } from "@nestjs/common";
import { RoomsService } from "./providers/rooms.service";
import { RoomsController } from "./rooms.controller";

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
