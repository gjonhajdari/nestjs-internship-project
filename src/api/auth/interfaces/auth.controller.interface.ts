import { LoginDto } from "../dtos/login.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { RegisterDTO } from "../dtos/register.dto";
import { Tokens } from "../types";

export interface IAuthController {
  register: (body: RegisterDTO) => Promise<Tokens>;
  login: (body: LoginDto) => Promise<Tokens>;
  logout: (user: string) => Promise<void>;
  refreshToken: (body: RefreshTokenDto) => Promise<Tokens>;
}
