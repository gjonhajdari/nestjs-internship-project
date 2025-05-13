import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { ForgotPasswordDto, ResetPasswordDto } from "../dtos/password-reset.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User } from "../entities/user.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUsersController {
  getMe(user: User): Promise<User>;

  findOne(userId: string): Promise<User>;

  updateMe(user: User, body: UpdateUserDto): Promise<User>;

  deleteMe(user: User): Promise<IDeleteStatus>;

  forgotPassword(body: ForgotPasswordDto): Promise<void>;

  resetPassword(token: string, body: ResetPasswordDto): Promise<void>;
}
