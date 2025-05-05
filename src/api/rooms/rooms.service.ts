import { tryCatch } from "@maxmorozoff/try-catch-tuple";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { DataSource, EntityManager } from "typeorm";
import { User } from "../user/entities/user.entity";
import { UsersService } from "../user/users.service";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { RoomUsers } from "./entities/room-users.entity";
import { Room } from "./entities/room.entity";
import { Roles } from "./enums/roles.enum";
import { IRoomsService } from "./interfaces/rooms.service.interface";
import { RoomUsersRepository } from "./repository/room-users.repository";
import { RoomsRepository } from "./repository/rooms.repository";

@Injectable()
export class RoomsService implements IRoomsService {
  constructor(
    private roomsRepository: RoomsRepository,
    private roomUsersRepository: RoomUsersRepository,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async findById(roomId: string): Promise<Room> {
    const [room, error] = await tryCatch(
      this.roomsRepository.findOne({ where: { uuid: roomId } }),
    );

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    if (!room) {
      throw new NotFoundException("Room doesn't exist!");
    }
    return room;
  }

  async findRooms(): Promise<Room[]> {
    const [rooms, error] = await tryCatch(this.roomsRepository.find());

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return rooms;
  }

  async createRoom(payload: CreateRoomDto, userId: string): Promise<Room> {
    const [newRoom, error] = await tryCatch(
      this.dataSource.transaction(async (manager) => {
        const room = manager.create(Room, payload);
        const newRoom = await manager.save(Room, room);

        await this.joinRoomInternal(manager, userId, newRoom.uuid, Roles.HOST);

        return newRoom;
      }),
    );

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return newRoom;
  }

  async updateRoom(roomId: string, payload: UpdateRoomDto): Promise<Room> {
    const room = await this.findById(roomId);

    const [updatedRoom, error] = await tryCatch(
      this.roomsRepository.save({ ...room, ...payload }),
    );

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return updatedRoom;
  }

  async deleteRoom(roomId: string): Promise<IDeleteStatus> {
    const room = await this.findById(roomId);

    const [_, error] = await tryCatch(this.roomsRepository.softRemove(room));

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return {
      success: true,
      resourceType: "room",
      resourceId: room.uuid,
      message: "Room deleted successfully",
      timestamp: new Date(),
    };
  }

  private async joinRoomInternal(
    manager: EntityManager,
    userId: string,
    roomId: string,
    role?: Roles,
  ): Promise<RoomUsers> {
    const [roomUser, error] = await tryCatch(async () => {
      const room = await manager.findOneByOrFail(Room, { uuid: roomId });
      const user = await manager.findOneByOrFail(User, { uuid: userId });

      const join = manager.create(RoomUsers, {
        user,
        room,
        role,
      });

      return await manager.save(RoomUsers, join);
    });

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return roomUser;
  }

  async joinRoom(userId: string, roomId: string): Promise<RoomUsers> {
    const room = await this.findById(roomId);
    const user = await this.usersService.findOne(userId);

    const join = this.roomUsersRepository.create({ user: user, room: room });

    const [roomUser, error] = await tryCatch(this.roomUsersRepository.save(join));

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return roomUser;
  }

  async leaveRoom(userId: string, roomId: string): Promise<boolean> {
    throw new Error("Method not implemented");
  }

  async removeFromRoom(userId: string, roomId: string): Promise<boolean> {
    throw new Error("Method not implemented");
  }
}
