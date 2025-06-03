import { User } from "src/api/user/entities/user.entity";

export interface VerifyMail {
  code: string;
  user: User;
}
