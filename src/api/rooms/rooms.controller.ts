import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
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
import { GetCurrentUser } from "../../common/decorators/get-current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { IResponseStatus } from "../../common/interfaces/ResponseStatus.interface";
import { BadRequestResponse } from "../../common/interfaces/responses/bad-request.response";
import { DeletedResponse } from "../../common/interfaces/responses/deleted.response";
import { GetRoomsResponse } from "../../common/interfaces/responses/get-rooms.response";
import { NotFoundResponse } from "../../common/interfaces/responses/not-found.response";
import { UnauthorizedResponse } from "../../common/interfaces/responses/unauthorized.response";
import { User } from "../user/entities/user.entity";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { RoomUsers } from "./entities/room-users.entity";
import { Room } from "./entities/room.entity";
import { RoomRoles } from "./enums/room-roles.enum";
import { IRoomsController } from "./interfaces/rooms.controller.interface";
import { RoomsService } from "./rooms.service";

@ApiBearerAuth()
@ApiTags("Rooms")
@Controller("rooms")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
export class RoomsController implements IRoomsController {
  constructor(private roomsService: RoomsService) {}

  @ApiOperation({
    summary: "Get one room by id",
    description: "Retrieves the room with the specified id and it's relations",
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
    description: "Retrieves all current user's rooms",
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
  async findRooms(@GetCurrentUser() user: User): Promise<{ room: Room; role: RoomRoles }[]> {
    const { uuid } = user;
    return this.roomsService.findRooms(uuid);
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
    const { uuid } = user;
    return this.roomsService.createRoom(body, uuid);
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
  @Roles(RoomRoles.HOST)
  @Delete(":roomId")
  async delete(
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<IResponseStatus> {
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
  @Post(":roomId/join")
  async join(
    @GetCurrentUser() user: User,
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<RoomUsers> {
    const { uuid } = user;
    return this.roomsService.joinRoom(uuid, roomId);
  }

  @ApiOperation({
    summary: "Leave a room",
    description: "Leave a room as the logged in user",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the user left the room successfully",
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
  @Post(":roomId/leave")
  async leave(
    @GetCurrentUser() user: User,
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<IResponseStatus> {
    const { uuid } = user;
    return this.roomsService.leaveRoom(uuid, roomId);
  }

  @Roles(RoomRoles.HOST)
  @ApiOperation({
    summary: "Remove user from room",
    description: "Remove a user from a room",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the user left the room successfully",
    type: DeletedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the room doesn't exist",
    type: NotFoundResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided or user is not host",
    type: UnauthorizedResponse,
  })
  //TODO: add guard
  @Post(":roomId/remove/")
  async removeFromRoom(
    @Query("userId", new ParseUUIDPipe()) userId: string,
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<IResponseStatus> {
    return this.roomsService.leaveRoom(userId, roomId);
  }
}
