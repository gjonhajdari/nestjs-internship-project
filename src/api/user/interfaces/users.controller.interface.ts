import { ForgotPasswordDto, ResetPasswordDto } from "../dtos/password-reset.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User } from "../entities/user.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUsersController {
  // getHello(user: User): Promise<string>;

  // create(body: CreateUserDto): Promise<User>;

  getMe(user: User): Promise<User>;

  findOne(userId: string): Promise<User>;

  // findAll(): Promise<User[]>;

  updateMe(user: User, body: UpdateUserDto): Promise<User>;

  // updateUser(userId: string, body: UpdateUserDto): Promise<User>;

  delete(userId: string): Promise<void>;

  // addPermission(userId: string, permission: PermissinDto): Promise<void>;
  // removePermission(userId: string, permission: PermissinDto): Promise<void>;

  forgotPassword(body: ForgotPasswordDto): Promise<void>;

  resetPassword(token: string, body: ResetPasswordDto): Promise<void>;
}
