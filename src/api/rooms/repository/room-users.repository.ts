import { CustomRepository } from "src/common/db/decorators/CustomRepository.decorator";
import { Repository } from "typeorm";
import { RoomUsers } from "../entities/room-users.entity";

@CustomRepository(RoomUsers)
export class RoomUsersRepository extends Repository<RoomUsers> {}
