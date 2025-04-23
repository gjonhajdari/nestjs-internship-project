import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { UserGender } from '../../../../api/user/enums/userGender.enum';
import { In } from 'typeorm';
import { User } from '../../../../api/user/entities/user.entity';
import AppDataSource from '../../dataSource/data-source.initialize';

@Injectable()
export class UsersSeeder implements Seeder {
  async seed(): Promise<any> {
    const userRepository = AppDataSource.getRepository(User);

    const users = userRepository.create([
      {
        firstName: 'Argjend',
        lastName: 'Reqica',
        email: `argjend@kutia.net`,
        username: `Gjendi`,
        password:
          '$2b$10$nwibVTEz86tgqAAmQNY2eOkppbDvlAhfae1azWUdx9wBx5vbnpwQC',
        gender: UserGender.MALE,
        phone: '+38344740402',
      },
      {
        firstName: 'Lendrit',
        lastName: 'Shala',
        email: `lendrit@kutia.net`,
        username: `Daddy-man`,
        password:
          '$2b$10$nwibVTEz86tgqAAmQNY2eOkppbDvlAhfae1azWUdx9wBx5vbnpwQC',
        gender: UserGender.MALE,
        phone: '+38344740402',
      },
      {
        firstName: 'Leutrim',
        lastName: 'Shala',
        email: `leutrim@kutia.net`,
        username: `Leoooo`,
        password:
          '$2b$10$nwibVTEz86tgqAAmQNY2eOkppbDvlAhfae1azWUdx9wBx5vbnpwQC',
        gender: UserGender.MALE,
        phone: '+38344740402',
      },
      {
        firstName: 'Blend',
        lastName: 'Mehani',
        email: `blend@kutia.net`,
        username: `Blendi`,
        password:
          '$2b$10$nwibVTEz86tgqAAmQNY2eOkppbDvlAhfae1azWUdx9wBx5vbnpwQC',
        gender: UserGender.MALE,
        phone: '+38344******',
      },
    ]);
    await userRepository.save(users);
  }

  async drop(): Promise<any> {
    const userRepository = AppDataSource.getRepository(User);
    const emails = [
      'argjend@kutia.net',
      'blend@kutia.net',
      'lendrit@kutia.net',
      'leutrim@kutia.net',
    ];
    await userRepository.delete({ email: In(emails) });
  }
}

// seeder({
//   imports: [TypeOrmModule.forRoot(config as DataSourceOptions)],
// }).run([UsersSeeder]);
