import { User } from "../../user/entities/user.entity";
import { LoginDto } from "../dtos/login.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { RegisterDTO } from "../dtos/register.dto";
import { Tokens } from "../types";

export interface IAuthController {
  register: (body: RegisterDTO) => Promise<Tokens>;
  login: (body: LoginDto) => Promise<Tokens>;
  logout: (user: User) => Promise<void>;
  refreshToken: (body: RefreshTokenDto) => Promise<Tokens>;
}
