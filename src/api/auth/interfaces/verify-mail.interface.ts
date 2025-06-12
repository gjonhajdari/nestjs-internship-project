import { User } from "../../user/entities/user.entity";

export interface VerifyMail {
  code: string;
  user: User;
}
