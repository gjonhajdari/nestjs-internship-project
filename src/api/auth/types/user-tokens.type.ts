import { User } from '../../user/entities/user.entity';

export type TTokensUser = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
