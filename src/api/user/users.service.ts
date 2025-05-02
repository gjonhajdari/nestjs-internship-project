import { randomBytes } from "node:crypto";
import EventEmitter from "node:events";
import { Injectable } from "@nestjs/common";
import { UnprocessableEntityException } from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectEventEmitter } from "nest-emitter";
import { Repository } from "typeorm";
import { hashDataBrypt } from "../../services/providers";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "./dtos/password-reset.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { PasswordReset } from "./entities/reset-password.entity";
import { User } from "./entities/user.entity";
import { IUsersService } from "./interfaces/users.service.interface";
import { UsersRepository } from "./repository/users.repository";

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private userRepository: UsersRepository,
    @InjectRepository(PasswordReset)
    private passwordRepository: Repository<PasswordReset>,
    @InjectEventEmitter() private readonly emitter: EventEmitter,
  ) {}

  async create(payload: CreateUserDto): Promise<User> {
    return await this.userRepository.save(this.userRepository.create(payload));
  }

  /**
   * Gets a user from it's given UUID
   *
   * @param userId - Unique user UUID
   * @returns Promise that resolves to the found user
   * @throws {UnprocessableEntityException} - If no user is found with the given UUID
   */
  async findOne(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ uuid: userId });
    if (!user) {
      throw new UnprocessableEntityException("This user does not exist!");
    }
    return user;
  }

  /**
   * Gets all the users in the database
   *
   * @returns Promise that resolves to the found users array
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Updates a user in the database with the new given attributes
   *
   * @param userId - The unique UUID of the user
   * @param payload - Given attributes of the user to update
   * @returns Promise that resolves to the updated user
   * @throws {NotFoundException} - If no user is found with the given UUID
   */
  async updateUser(userId: string, payload: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);
    await this.userRepository.update(user.id, payload);

    return await this.findOne(userId);
  }

  /**
   * Deletes a user from the database
   *
   * @param userId - The unique UUID of the user
   * @throws {NotFoundException} - If no user with the given UUID is found
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await this.findOne(userId);
    await this.userRepository.softRemove(user);
  }

  // async addPermission(userId: string, permissionDto: PermissinDto): Promise<void> {
  //   const user = await this.findOne(userId);

  //   const permissionExist = checkPermissionsUtil(user.permissions, permissionDto.permission);
  //   if (permissionExist) {
  //     throw new UnprocessableEntityException("Permission was already added!");
  //   }
  //   user.permissions += permissionDto.permission;
  //   await this.userRepository.save(user);
  // }

  // async removePermission(userId: string, permissionDto: PermissinDto): Promise<void> {
  //   const user = await this.findOne(userId);

  //   const permissionExist = checkPermissionsUtil(user.permissions, permissionDto.permission);
  //   if (!permissionExist) {
  //     throw new UnprocessableEntityException("Permission was already removed");
  //   }
  //   user.permissions -= permissionDto.permission;
  //   await this.userRepository.save(user);
  // }

  /**
   * Sends an email to the user with a token to reset their password
   *
   * @param paload - Required attributes to send a password change request
   * @returns Promise that resolves to void
   * @throws {UnprocessableEntityException} - If no user is found with the given email
   */
  async forgotPassword(paload: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: paload.email },
    });

    if (!user) {
      throw new UnprocessableEntityException("This user does not exist!");
    }

    const count = await this.passwordRepository.count({
      where: { user: { id: user.id } },
    });

    if (count > 0) {
      await this.passwordRepository.delete({ user: user });
    }

    const token = randomBytes(16).toString("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    /**Send Email for forgotPassword*/
    const emailDetails = { user, token: token };
    this.emitter.emit("forgotPasswordMail", emailDetails);

    await this.passwordRepository.save({
      token,
      expiresAt,
      user,
    });
  }

  /**
   * Resets the password of a user
   *
   * @param token - The token sent to the user
   * @param payload - Required attributes to reset the password
   * @returns Promise that resolves to void
   * @throws {UnprocessableEntityException} - If no user is found with the given token
   */
  async resetPassword(token: string, payload: ResetPasswordDto): Promise<void> {
    const passwordReset = await this.passwordRepository.findOne({
      where: { token },
      relations: ["user"],
    });

    if (!passwordReset?.expiresAt || passwordReset.expiresAt < new Date()) {
      throw new UnprocessableEntityException("Invalid token for password reset!");
    }

    const { user } = passwordReset;

    user.password = await hashDataBrypt(payload.password);

    await this.userRepository.save(user);
    await this.passwordRepository.delete({ user: user });
  }
}
