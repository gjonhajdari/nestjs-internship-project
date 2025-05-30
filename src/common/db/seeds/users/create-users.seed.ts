import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { In } from "typeorm";
import { User } from "../../../../api/user/entities/user.entity";
import AppDataSource from "../../dataSource/data-source.initialize";

@Injectable()
export class UsersSeeder implements Seeder {
  async seed(): Promise<any> {
    const userRepository = AppDataSource.getRepository(User);

    const users = userRepository.create([
      {
        firstName: "Argjend",
        lastName: "Reqica",
        email: "argjend@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Lendrit",
        lastName: "Shala",
        email: "lendrit@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Leutrim",
        lastName: "Shala",
        email: "leutrim@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Blend",
        lastName: "Mehani",
        email: "blend@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
    ]);
    await userRepository.save(users);
  }

  async drop(): Promise<any> {
    const userRepository = AppDataSource.getRepository(User);
    const emails = [
      "argjend@kutia.net",
      "blend@kutia.net",
      "lendrit@kutia.net",
      "leutrim@kutia.net",
    ];
    await userRepository.delete({ email: In(emails) });
  }
}

// seeder({
//   imports: [TypeOrmModule.forRoot(config as DataSourceOptions)],
// }).run([UsersSeeder]);
