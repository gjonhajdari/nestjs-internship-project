import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomRepositoryModule } from "../../common/db/CustomRepository.module";
import { User } from "../user/entities/user.entity";
import { VerifyEmail } from "../user/entities/verify-email.entity";
import { UsersRepository } from "../user/repository/users.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants/constants";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";

@Module({
  imports: [
    JwtModule.register({ secret: jwtConstants.access_token_secret }),
    CustomRepositoryModule.forCustomRepository([UsersRepository]),
    TypeOrmModule.forFeature([User, VerifyEmail]),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy],
})
export class AuthModule {}
