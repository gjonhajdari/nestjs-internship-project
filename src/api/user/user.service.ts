import { Injectable } from '@nestjs/common';
import checkPermissionsUtil from '../../utils/checkPermissions.util';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { IUserService } from './interfaces/user.service.interface';
import { PermissinDto } from './dtos/permission.dto';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';
import { ForgotPasswordDto, ResetPasswordDto } from './dtos/password-reset.dto';
import { PasswordReset } from './entities/reset-password.entity';
import { hashDataBrypt } from '../../services/providers';
import { randomBytes } from 'crypto';
import { UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectEventEmitter } from 'nest-emitter';
import EventEmitter from 'events';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private userRepository: UserRepository,
    @InjectRepository(PasswordReset)
    private passwordRepository: Repository<PasswordReset>,
    @InjectEventEmitter() private readonly emitter: EventEmitter,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(
      this.userRepository.create(createUserDto),
    );
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ uuid: userId });
    if (!user) {
      throw new UnprocessableEntityException('This user does not exist!');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);
    await this.userRepository.update(user.id, updateUserDto);
    return await this.findOne(userId);
  }

  async remove(userId: string): Promise<void> {
    const user = await this.findOne(userId);
    await this.userRepository.remove(user);
  }

  async addPermission(
    userId: string,
    permissionDto: PermissinDto,
  ): Promise<void> {
    const user = await this.findOne(userId);

    const permissionExist = checkPermissionsUtil(
      user.permissions,
      permissionDto.permission,
    );
    if (permissionExist) {
      throw new UnprocessableEntityException('Permission was already added!');
    }
    user.permissions += permissionDto.permission;
    await this.userRepository.save(user);
  }

  async removePermission(
    userId: string,
    permissionDto: PermissinDto,
  ): Promise<void> {
    const user = await this.findOne(userId);

    const permissionExist = checkPermissionsUtil(
      user.permissions,
      permissionDto.permission,
    );
    if (!permissionExist) {
      throw new UnprocessableEntityException('Permission was already removed');
    }
    user.permissions -= permissionDto.permission;
    await this.userRepository.save(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new UnprocessableEntityException('This user does not exist!');
    }

    const count = await this.passwordRepository.count({
      where: { user: { id: user.id } },
    });

    if (count > 0) {
      await this.passwordRepository.delete({ user: user });
    }

    const token = randomBytes(16).toString('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    /**Send Email for forgotPassword*/
    const emailDetails = { user: user.email, token: token };
    this.emitter.emit('forgotPasswordMail', emailDetails);

    await this.passwordRepository.save({
      token,
      expiresAt,
      user,
    });
  }

  async resetPassword(
    token: string,
    resetPassworDto: ResetPasswordDto,
  ): Promise<void> {
    const passwordReset = await this.passwordRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!passwordReset?.expiresAt || passwordReset.expiresAt < new Date()) {
      throw new UnprocessableEntityException(
        'Invalid token for password reset!',
      );
    }

    const { user } = passwordReset;

    user.password = await hashDataBrypt(resetPassworDto.password);

    await this.userRepository.save(user);
    await this.passwordRepository.delete({ user: user });
  }
}
