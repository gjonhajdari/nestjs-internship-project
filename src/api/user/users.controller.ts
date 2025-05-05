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
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
import { DeletedResponse } from "src/common/interfaces/responses/deleted.response";
import { NotFoundResponse } from "src/common/interfaces/responses/not-found.response";
import { UnprocessableEntityResponse } from "src/common/interfaces/responses/unprocessable-entity.response";
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

  @ApiOperation({
    summary: "Get the current user",
    description: "Retrieves the current user based on the provided token",
  })
  @ApiOkResponse({
    description: "A 200 response if the user is found successfully",
    type: User,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the user doesn't exist",
    type: NotFoundResponse,
  })
  @Get("me")
  async getMe(@GetCurrentUser() user: User): Promise<User> {
    return await this.usersService.findOne(user.uuid);
  }

  // example how roles work
  // @Roles(UserRoles.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get a user by ID",
    description: "Retrieves a user based on the provided UUID",
  })
  @ApiOkResponse({
    description: "A 200 response if the user is found successfully",
    type: User,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the user doesn't exist",
    type: NotFoundResponse,
  })
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

  @ApiOperation({
    summary: "Update the current user",
    description: "Updates the current user based on the provided token",
  })
  @ApiOkResponse({
    description: "A 200 response if the user is updated successfully",
    type: User,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the user doesn't exist",
    type: NotFoundResponse,
  })
  @Patch("me")
  async updateMe(@GetCurrentUser() user: User, @Body() body: UpdateUserDto) {
    return await this.usersService.updateUser(user.uuid, body);
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
  @ApiOperation({
    summary: "Delete the current user",
    description: "Deletes the current user based on the provided token",
  })
  @ApiOkResponse({
    description: "A 200 response if the user is deleted successfully",
    type: DeletedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the user doesn't exist",
    type: NotFoundResponse,
  })
  @Delete("/me")
  async deleteMe(@GetCurrentUser() user: User): Promise<IDeleteStatus> {
    return await this.usersService.deleteUser(user.uuid);
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

  @ApiOperation({
    summary: "Send a password reset email",
    description: "Sends an email to the user with a token to reset their password",
  })
  @ApiOkResponse({
    description: "A 200 response if the email is sent successfully",
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the user doesn't exist",
    type: NotFoundResponse,
  })
  @Public()
  @Post("forgot")
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<void> {
    return await this.usersService.forgotPassword(body);
  }

  @ApiOperation({
    summary: "Reset the user's password",
    description: "Resets the user's password using the provided token",
  })
  @ApiOkResponse({
    description: "A 200 response if the password is reset successfully",
  })
  @ApiUnprocessableEntityResponse({
    description: "A 422 error if the token is invalid or expired",
    type: UnprocessableEntityResponse,
  })
  @Public()
  @Post("reset/:token")
  async resetPassword(
    @Param("token") token: string,
    @Body() body: ResetPasswordDto,
  ): Promise<void> {
    return await this.usersService.resetPassword(token, body);
  }
}
