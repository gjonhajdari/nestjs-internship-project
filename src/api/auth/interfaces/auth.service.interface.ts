import { RegisterDTO } from '../dtos/register.dto';
import { Tokens } from '../types/tokens.types';
import { LoginDto } from '../dtos/login.dto';

export interface IAuthService {
  signup: (body: RegisterDTO) => Promise<Tokens>;
  login: (body: LoginDto) => Promise<Tokens>;
  logout: (user: string) => Promise<void>;
  refreshToken: (user: string, refreshToken: string) => Promise<Tokens>;
}
