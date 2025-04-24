import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { PasswordReset } from "./entities/reset-password.entity";
import { UsersRepository } from "./repository/users.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([UsersRepository]),
    TypeOrmModule.forFeature([PasswordReset]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UserModule {}
