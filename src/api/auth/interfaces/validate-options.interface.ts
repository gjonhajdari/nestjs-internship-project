import { User } from "../../user/entities/user.entity";

export interface ValidateOptions extends Partial<User> {
  message?: string;
}
