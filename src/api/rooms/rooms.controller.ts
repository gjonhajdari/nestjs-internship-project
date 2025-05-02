import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUser } from "src/common/decorators/get-current-user.decorator";
import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { User } from "../user/entities/user.entity";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { RoomUsers } from "./entities/room-users.entity";
import { Room } from "./entities/room.entity";
import { IRoomsController } from "./interfaces/rooms.controller.interface";
import { RoomsService } from "./rooms.service";

@ApiBearerAuth()
@ApiTags("Rooms")
@Controller("rooms")
export class RoomsController implements IRoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get(":roomId")
  async findById(@Param("roomId", new ParseUUIDPipe()) roomId: string): Promise<Room> {
    return this.roomsService.findById(roomId);
  }

  @Get()
  async findRooms(): Promise<Room[]> {
    return this.roomsService.findRooms();
  }

  @Post()
  async create(@Body() body: CreateRoomDto, @GetCurrentUser() user: User): Promise<Room> {
    return this.roomsService.createRoom(body, user.uuid);
  }

  @Patch(":roomId")
  async update(
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
    body: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomsService.updateRoom(roomId, body);
  }

  @Delete(":roomId")
  async delete(@Param("roomId", new ParseUUIDPipe()) roomId: string): Promise<IDeleteStatus> {
    return this.roomsService.deleteRoom(roomId);
  }

  @Post("join/:roomId")
  async join(
    @GetCurrentUser() user: User,
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<RoomUsers> {
    return this.roomsService.joinRoom(user.uuid, roomId);
  }

  @Post("leave/:roomId")
  async leave(
    @GetCurrentUser() user: User,
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<boolean> {
    return this.roomsService.leaveRoom(user.uuid, roomId);
  }

  @Post("remove/:roomId")
  async removeFromRoom(
    @Body() body: string,
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<boolean> {
    return this.roomsService.removeFromRoom(body, roomId);
  }
}
