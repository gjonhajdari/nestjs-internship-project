import { BaseCustomRepository } from "../../../common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "../../../common/db/decorators/CustomRepository.decorator";
import { User } from "../entities/user.entity";
import { IUsersRepository } from "../interfaces/users.repository.interface";

@CustomRepository(User)
export class UsersRepository extends BaseCustomRepository<User> implements IUsersRepository {}
