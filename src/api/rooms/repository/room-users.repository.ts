import { Repository } from "typeorm";
import { CustomRepository } from "../../../common/db/decorators/CustomRepository.decorator";
import { RoomUsers } from "../entities/room-users.entity";

@CustomRepository(RoomUsers)
export class RoomUsersRepository extends Repository<RoomUsers> {}
