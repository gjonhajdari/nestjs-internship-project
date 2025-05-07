import { LoginDto } from "../dtos/login.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { RegisterDTO } from "../dtos/register.dto";
import { Tokens } from "../types/tokens.types";

export interface IAuthService {
  signup: (payload: RegisterDTO) => Promise<Tokens>;
  login: (payload: LoginDto) => Promise<Tokens>;
  logout: (user: string) => Promise<void>;
  refreshToken: (payoad: RefreshTokenDto) => Promise<Tokens>;
}
