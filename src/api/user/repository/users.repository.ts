import { FindOneOptions, FindOptionsWhere } from "typeorm";
import { BaseCustomRepository } from "../../../common/db/customBaseRepository/BaseCustomRepository";
import { CustomRepository } from "../../../common/db/decorators/CustomRepository.decorator";
import { User } from "../entities/user.entity";
import { IUsersRepository } from "../interfaces/users.repository.interface";

@CustomRepository(User)
export class UsersRepository extends BaseCustomRepository<User> implements IUsersRepository {
  async findOne(options: FindOneOptions<User>): Promise<User> {
    return await super.findOne({
      ...options,
      where: {
        ...options?.where,
        deletedAt: null,
        isVerified: (options.where as FindOptionsWhere<User>).isVerified ?? true,
      },
    });
  }
}
