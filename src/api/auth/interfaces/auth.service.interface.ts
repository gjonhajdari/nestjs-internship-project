import { IResponseStatus } from "../../../common/interfaces/ResponseStatus.interface";
import { LoginDto } from "../dtos/login.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { RegisterDTO } from "../dtos/register.dto";
import { Tokens } from "../types/tokens.types";
import { TTokensUser } from "../types/user-tokens.type";

export interface IAuthService {
  signup: (payload: RegisterDTO) => Promise<IResponseStatus>;
  login: (payload: LoginDto) => Promise<Tokens>;
  logout: (user: string) => Promise<void>;
  refreshToken: (payoad: RefreshTokenDto) => Promise<Tokens>;
  verifyEmail(email: string, code: number): Promise<TTokensUser>;
  sendVerificationEmail(email: string): Promise<IResponseStatus>;
}
