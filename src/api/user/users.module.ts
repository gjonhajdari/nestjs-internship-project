import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { RoomsModule } from "../rooms/rooms.module";
import { PasswordReset } from "./entities/reset-password.entity";
import { UsersRepository } from "./repository/users.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([UsersRepository]),
    TypeOrmModule.forFeature([PasswordReset]),
    forwardRef(() => RoomsModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}
