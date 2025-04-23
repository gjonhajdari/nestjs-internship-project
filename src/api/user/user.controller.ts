import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IUserController } from './interfaces/user.controller.interface';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permission } from '../../common/decorators/permissions.decorator';
import { UserPermissions } from './enums/permissions.enum';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissinDto } from './dtos/permission.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoles } from './enums/roles.enum';
import { PaginationInterceptor } from '../../common/interceptors/pagination.interceptor';
import { ForgotPasswordDto, ResetPasswordDto } from './dtos/password-reset.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UsePipes(new ValidationPipe())
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
@UseGuards(RolesGuard)
export class UserController implements IUserController {
  constructor(private readonly usersService: UserService) {}

  //example how permissions work
  @Permission(UserPermissions.CAN_ACCESS_HELLO_METHOD)
  @Get('hello')
  async getHello() {
    return `Hello from Hello Method`;
  }

  @Roles(UserRoles.SUPER_ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get('me')
  async getMe(@GetCurrentUser() user: User): Promise<User> {
    return await this.usersService.findOne(user.uuid);
  }

  // example how roles work
  @Roles(UserRoles.SUPER_ADMIN)
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  @Roles(UserRoles.SUPER_ADMIN)
  @Get()
  @UseInterceptors(PaginationInterceptor)
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Patch('me')
  async updateMe(
    @GetCurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(user.uuid, updateUserDto);
  }

  @Roles(UserRoles.SUPER_ADMIN)
  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Roles(UserRoles.SUPER_ADMIN)
  @Delete(':userId')
  async remove(@Param('userId') userId: string): Promise<void> {
    return await this.usersService.remove(userId);
  }

  @Roles(UserRoles.SUPER_ADMIN)
  @Post('add-permission/:userId')
  async addPermission(
    @Param('userId') userId: string,
    @Body() permission: PermissinDto,
  ): Promise<void> {
    return this.usersService.addPermission(userId, permission);
  }

  @Roles(UserRoles.SUPER_ADMIN)
  @Post('remove-permission/:userId')
  async removePermission(
    @Param('userId') userId: string,
    @Body() permission: PermissinDto,
  ): Promise<void> {
    return this.usersService.removePermission(userId, permission);
  }

  @Public()
  @Post('forgot')
  async forgotPassword(
    @Body() forgotPassword: ForgotPasswordDto,
  ): Promise<void> {
    return await this.usersService.forgotPassword(forgotPassword);
  }

  @Public()
  @Post('reset/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return await this.usersService.resetPassword(token, resetPasswordDto);
  }
}
