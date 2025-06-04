// remove eslint comment when you start to populate the interface

import { RegisterDTO } from "src/api/auth/dtos/register.dto";
import { IResponseStatus } from "src/common/interfaces/ResponseStatus.interface";
import { ForgotPasswordDto, ResetPasswordDto } from "../dtos/password-reset.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User } from "../entities/user.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUsersService {
  create(payload: RegisterDTO): Promise<User>;

  findOne(userId: string): Promise<User>;

  findAll(): Promise<User[]>;

  updateUser(userId: string, payload: UpdateUserDto): Promise<User>;

  deleteUser(userId: string): Promise<IResponseStatus>;

  forgotPassword(forgotPassword: ForgotPasswordDto): Promise<void>;

  resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<void>;
}
