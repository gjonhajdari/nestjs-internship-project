import { BaseCustomRepository } from "src/common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "src/common/db/decorators/CustomRepository.decorator";
import { Rooms } from "../entities/rooms.entity";
import { IRoomsRepository } from "../interfaces/rooms.repository.interface";

@CustomRepository(Rooms)
export class RoomsRepository extends BaseCustomRepository<Rooms> implements IRoomsRepository {}
