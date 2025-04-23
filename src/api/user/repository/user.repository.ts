import { BaseCustomRepository } from '../../../common/db/customBaseRepository/BaseCustomRepository';
import { CustomRepository } from '../../../common/db/decorators/CustomRepository.decorator';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';

@CustomRepository(User)
export class UserRepository
  extends BaseCustomRepository<User>
  implements IUserRepository {}
