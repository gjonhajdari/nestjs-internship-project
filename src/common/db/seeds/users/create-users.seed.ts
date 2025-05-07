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
        firstName: "Gjon",
        lastName: "Hajdari",
        email: "gjon@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Desara",
        lastName: "Qerimi",
        email: "desara@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Endi",
        lastName: "Salihu",
        email: "endi@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Era",
        lastName: "Ibrahimi",
        email: "era@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Elsa",
        lastName: "Tafilaj",
        email: "elsa@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Rrezart",
        lastName: "Merovci",
        email: "rrezart@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
      {
        firstName: "Albi",
        lastName: "Hoti",
        email: "albi@kutia.net",
        password: "$2a$12$y1bFqKN/3fhrSVimtXZx6ugAl0wooBSplaAjssJGrOedL2KSnLER6",
      },
    ]);
    await userRepository.save(users);
  }

  async drop(): Promise<any> {
    const userRepository = AppDataSource.getRepository(User);
    const emails = [
      "gjon@kutia.net",
      "desara@kutia.net",
      "endi@kutia.net",
      "era@kutia.net",
      "elsa@kutia.net",
      "rrezart@kutia.net",
      "albi@kutia.net",
    ];
    await userRepository.delete({ email: In(emails) });
  }
}

// seeder({
//   imports: [TypeOrmModule.forRoot(config as DataSourceOptions)],
// }).run([UsersSeeder]);
