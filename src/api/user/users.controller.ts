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
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUser } from "../../common/decorators/get-current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { ForgotPasswordDto, ResetPasswordDto } from "./dtos/password-reset.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { User } from "./entities/user.entity";
import { IUsersController } from "./interfaces/users.controller.interface";
import { UsersService } from "./users.service";

@Controller("users")
@ApiBearerAuth()
@ApiTags("Users")
@UsePipes(new ValidationPipe())
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
@UseGuards(RolesGuard)
export class UsersController implements IUsersController {
  constructor(private readonly usersService: UsersService) {}

  // //example how permissions work
  // @Permission(UserPermissions.CAN_ACCESS_HELLO_METHOD)
  // @Get("hello")
  // async getHello() {
  //   return "Hello from Hello Method";
  // }

  // @Roles(UserRoles.SUPER_ADMIN)
  // @Post()
  // async create(@Body() body: CreateUserDto): Promise<User> {
  //   return await this.usersService.create(body);
  // }

  @Get("me")
  async getMe(@GetCurrentUser() user: User): Promise<User> {
    return await this.usersService.findOne(user.uuid);
  }

  // example how roles work
  // @Roles(UserRoles.SUPER_ADMIN)
  @Get(":userId")
  async findOne(@Param("userId") userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  // @Roles(UserRoles.SUPER_ADMIN)
  // @Get()
  // @UseInterceptors(PaginationInterceptor)
  // async findAll(): Promise<User[]> {
  //   return await this.usersService.findAll();
  // }

  @Patch("me")
  async updateMe(@GetCurrentUser() user: User, @Body() body: UpdateUserDto) {
    return await this.usersService.update(user.uuid, body);
  }

  // @Roles(UserRoles.SUPER_ADMIN)
  // @Patch(":userId")
  // async updateUser(
  //   @Param("userId") userId: string,
  //   @Body() body: UpdateUserDto,
  // ): Promise<User> {
  //   return await this.usersService.update(userId, body);
  // }

  // @Roles(UserRoles.SUPER_ADMIN)
  @Delete(":userId")
  async remove(@Param("userId") userId: string): Promise<void> {
    return await this.usersService.remove(userId);
  }

  // @Roles(UserRoles.SUPER_ADMIN)
  // @Post("add-permission/:userId")
  // async addPermission(
  //   @Param("userId") userId: string,
  //   @Body() permission: PermissinDto,
  // ): Promise<void> {
  //   return this.usersService.addPermission(userId, permission);
  // }

  // @Roles(UserRoles.SUPER_ADMIN)
  // @Post("remove-permission/:userId")
  // async removePermission(
  //   @Param("userId") userId: string,
  //   @Body() permission: PermissinDto,
  // ): Promise<void> {
  //   return this.usersService.removePermission(userId, permission);
  // }

  @Public()
  @Post("forgot")
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<void> {
    return await this.usersService.forgotPassword(body);
  }

  @Public()
  @Post("reset/:token")
  async resetPassword(
    @Param("token") token: string,
    @Body() body: ResetPasswordDto,
  ): Promise<void> {
    return await this.usersService.resetPassword(token, body);
  }
}
