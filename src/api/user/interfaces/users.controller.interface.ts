import { IResponseStatus } from "src/common/interfaces/ResponseStatus.interface";
import { ForgotPasswordDto, ResetPasswordDto } from "../dtos/password-reset.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User } from "../entities/user.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUsersController {
  getMe(user: User): Promise<User>;

  findOne(userId: string): Promise<User>;

  updateMe(user: User, body: UpdateUserDto): Promise<User>;

  deleteMe(user: User): Promise<IResponseStatus>;

  forgotPassword(body: ForgotPasswordDto): Promise<IResponseStatus>;

  resetPassword(token: string, body: ResetPasswordDto): Promise<void>;
}
