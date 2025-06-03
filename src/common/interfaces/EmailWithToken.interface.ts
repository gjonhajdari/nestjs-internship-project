import { User } from "../../api/user/entities/user.entity";

export interface EmailWithToken {
  user: User;
  token: string;
}
