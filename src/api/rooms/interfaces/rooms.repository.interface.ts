import { IBaseCustomRepository } from "../../../common/db/customBaseRepository/interfaces/BaseCustomRepository.interface";
import { Room } from "../entities/room.entity";

export interface IRoomsRepository extends IBaseCustomRepository<Room> {}
