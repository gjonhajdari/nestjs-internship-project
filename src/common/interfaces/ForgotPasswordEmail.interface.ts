import { User } from "src/api/user/entities/user.entity";

export interface ForgotPasswordEmail {
  user: User;
  token: string;
}
