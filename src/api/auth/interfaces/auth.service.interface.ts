import { LoginDto } from "../dtos/login.dto";
import { RegisterDTO } from "../dtos/register.dto";
import { Tokens } from "../types/tokens.types";

export interface IAuthService {
  signup: (payload: RegisterDTO) => Promise<Tokens>;
  login: (payload: LoginDto) => Promise<Tokens>;
  logout: (user: string) => Promise<void>;
  refreshToken: (user: string, refreshToken: string) => Promise<Tokens>;
}
