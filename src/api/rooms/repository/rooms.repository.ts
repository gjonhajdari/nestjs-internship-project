import { BaseCustomRepository } from "../../../common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "../../../common/db/decorators/CustomRepository.decorator";
import { Room } from "../entities/room.entity";
import { IRoomsRepository } from "../interfaces/rooms.repository.interface";

@CustomRepository(Room)
export class RoomsRepository extends BaseCustomRepository<Room> implements IRoomsRepository {}
