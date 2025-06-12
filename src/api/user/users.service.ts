import { randomBytes } from "node:crypto";
import EventEmitter from "node:events";
import { Injectable } from "@nestjs/common";
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectEventEmitter } from "nest-emitter";
import { Repository } from "typeorm";
import { IDeleteStatus } from "../../common/interfaces/DeleteStatus.interface";
import { compareHashedDataBcrypt, hashDataBrypt } from "../../services/providers";
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
      throw new NotFoundException("This user does not exist!");
    }
    return user;
  }

  /**
   * Gets all users in a specific room
   *
   * @param roomId - Unique room UUID
   * @returns Promise that resolves to the found users
   * @throws {NotFoundException} - If no users are found with the given room UUID
   */
  async findByRoom(roomId: string): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .innerJoin("user.rooms", "roomUser")
      .innerJoin("roomUser.room", "room")
      .where("room.uuid = :roomId", { roomId })
      .select([
        "user.uuid as uuid",
        "user.firstName as firstName",
        "user.lastName as lastName",
        "user.email as email",
        "user.createdAt as createdAt",
        "roomUser.role as role",
      ])
      .addSelect("roomUser.role", "role")
      .getRawMany();
    if (!users || users.length === 0) {
      throw new NotFoundException("This room's users not found!");
    }
    return users;
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
  async deleteUser(userId: string): Promise<IDeleteStatus> {
    const user = await this.findOne(userId);
    await this.userRepository.softRemove(user);

    return {
      success: true,
      resourceType: "user",
      resourceId: userId,
      message: "User deleted successfully",
      timestamp: new Date(),
    };
  }

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
      throw new NotFoundException("This user does not exist!");
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

    user.password = await hashDataBrypt(payload.newPassword);

    await this.userRepository.save(user);
    await this.passwordRepository.delete({ user: user });
  }

  /**
   * Updates the password of a user
   *
   * @param userId - The unique UUID of the user
   * @param payload - Required attributes to update the password
   * @returns Promise that resolves to void
   * @throws {UnprocessableEntityException} - If no user is found with the given UUID
   * @throws {BadRequestException} - If both entered passwords do not match
   * @throws {BadRequestException} - If the new password is the same as the old one
   */
  async updatePassword(userId: string, payload: ResetPasswordDto): Promise<void> {
    const user = await this.findOne(userId);

    const matches = await compareHashedDataBcrypt(payload.oldPassword, user.password);

    if (!matches) throw new BadRequestException("Old password incorrect");

    const sameAsOld = await compareHashedDataBcrypt(payload.newPassword, user.password);

    if (sameAsOld)
      throw new BadRequestException("New password can't be the same as the old one");

    user.password = await hashDataBrypt(payload.newPassword);
    await this.userRepository.save(user);
  }
}
