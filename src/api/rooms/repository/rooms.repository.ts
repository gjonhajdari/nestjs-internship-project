import { BaseCustomRepository } from "src/common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "src/common/db/decorators/CustomRepository.decorator";
import { Room } from "../entities/room.entity";
import { IRoomsRepository } from "../interfaces/rooms.repository.interface";

@CustomRepository(Room)
export class RoomsRepository extends BaseCustomRepository<Room> implements IRoomsRepository {}
