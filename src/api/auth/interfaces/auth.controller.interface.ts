import { LoginDto } from '../dtos/login.dto';
import { RegisterDTO } from '../dtos/register.dto';
import { TGetCurrentUser, Tokens } from '../types';

export interface IAuthController {
  register: (body: RegisterDTO) => Promise<Tokens>;
  login: (body: LoginDto) => Promise<Tokens>;
  logout: (user: string) => Promise<void>;
  refreshToken: (
    user: TGetCurrentUser,
    refreshToken: string,
  ) => Promise<Tokens>;
}
