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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { GetCurrentUser } from "src/common/decorators/get-current-user.decorator";
import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { BadRequestResponse } from "src/common/interfaces/responses/bad-request.response";
import { DeletedResponse } from "src/common/interfaces/responses/deleted.response";
import { GetRoomsResponse } from "src/common/interfaces/responses/get-rooms.response";
import { NotFoundResponse } from "src/common/interfaces/responses/not-found.response";
import { UnauthorizedResponse } from "src/common/interfaces/responses/unauthorized.response";
import { User } from "../user/entities/user.entity";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { RoomUsers } from "./entities/room-users.entity";
import { Room } from "./entities/room.entity";
import { Roles } from "./enums/roles.enum";
import { IRoomsController } from "./interfaces/rooms.controller.interface";
import { RoomsService } from "./rooms.service";

@ApiBearerAuth()
@ApiTags("Rooms")
@Controller("rooms")
export class RoomsController implements IRoomsController {
  constructor(private roomsService: RoomsService) {}

  @ApiOperation({
    summary: "Get one room by id",
    description: "Retrieves the room with the specified id",
  })
  @ApiOkResponse({
    description: "A 200 response if room is found",
    type: Room,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the room doesn't exist",
    type: NotFoundResponse,
  })
  @Get(":roomId")
  async findById(@Param("roomId", new ParseUUIDPipe()) roomId: string): Promise<Room> {
    return this.roomsService.findById(roomId);
  }

  @ApiOperation({
    summary: "Get all rooms",
    description: "Retrieves all rooms",
  })
  @ApiOkResponse({
    description: "A 200 response if rooms are found successfully",
    type: GetRoomsResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @Get()
  async findRooms(@GetCurrentUser() user: User): Promise<{ room: Room; role: Roles }[]> {
    return this.roomsService.findRooms(user.uuid);
  }

  @ApiOperation({
    summary: "Create a new room",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the room is created successfully",
    type: Room,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @Post()
  async create(@Body() body: CreateRoomDto, @GetCurrentUser() user: User): Promise<Room> {
    return this.roomsService.createRoom(body, user.uuid);
  }

  @ApiOperation({
    summary: "Update a room",
    description: "Updates an existing room",
  })
  @ApiOkResponse({
    description: "A 200 response if the room is updated successfully",
    type: Room,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the room doesn't exist",
    type: NotFoundResponse,
  })
  @ApiBadRequestResponse({
    description: "A 400 error if the request body is invalid",
    type: BadRequestResponse,
  })
  @Patch(":roomId")
  async update(
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
    @Body() body: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomsService.updateRoom(roomId, body);
  }

  @ApiOperation({
    summary: "Delete a room",
    description: "Deletes an existing room",
  })
  @ApiOkResponse({
    description: "A 200 response if the room is deleted successfully",
    type: DeletedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the room doesn't exist",
    type: NotFoundResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @Delete(":roomId")
  async delete(@Param("roomId", new ParseUUIDPipe()) roomId: string): Promise<IDeleteStatus> {
    return this.roomsService.deleteRoom(roomId);
  }

  @ApiOperation({
    summary: "Join a room",
    description: "Join a room as a participant",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the user joined room successfully",
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the room doesn't exist",
    type: NotFoundResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
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
