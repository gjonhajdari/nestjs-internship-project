// remove eslint comment when you start to populate the interface

import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "../dtos/password-reset.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User } from "../entities/user.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<User>;

  findOne(userId: string): Promise<User>;

  findAll(): Promise<User[]>;

  updateUser(userId: string, payload: UpdateUserDto): Promise<User>;

  deleteUser(userId: string): Promise<IDeleteStatus>;

  forgotPassword(forgotPassword: ForgotPasswordDto): Promise<void>;

  resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<void>;
}
