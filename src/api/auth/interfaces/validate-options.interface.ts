import { User } from "src/api/user/entities/user.entity";

export interface ValidateOptions extends Partial<User> {
  message?: string;
}
