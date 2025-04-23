// remove eslint comment when you start to populate the interface

import { CreateUserDto } from '../dtos/create-user.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos/password-reset.dto';
import { PermissinDto } from '../dtos/permission.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserController {
  getHello(user: User): Promise<string>;

  create(createUserDto: CreateUserDto): Promise<User>;

  getMe(user: User): Promise<User>;

  findOne(userId: string): Promise<User>;

  findAll(): Promise<User[]>;

  updateMe(user: User, updateUserDto: UpdateUserDto): Promise<User>;

  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>;

  remove(userId: string): Promise<void>;

  addPermission(userId: string, permission: PermissinDto): Promise<void>;

  removePermission(userId: string, permission: PermissinDto): Promise<void>;
  forgotPassword(forgotPassword: ForgotPasswordDto): Promise<void>;
  resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void>;
}
