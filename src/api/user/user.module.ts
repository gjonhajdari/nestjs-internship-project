import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { PasswordReset } from "./entities/reset-password.entity";
import { UserRepository } from "./repository/user.repository";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([PasswordReset]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
