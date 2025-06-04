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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { GetCurrentUser } from "../../common/decorators/get-current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { IResponseStatus } from "../../common/interfaces/ResponseStatus.interface";
import { BadRequestResponse } from "../../common/interfaces/responses/bad-request.response";
import { DeletedResponse } from "../../common/interfaces/responses/deleted.response";
import { NotFoundResponse } from "../../common/interfaces/responses/not-found.response";
import { UnprocessableEntityResponse } from "../../common/interfaces/responses/unprocessable-entity.response";
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
export class UsersController implements IUsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @ApiOperation({
    summary: "Get users by room UUID",
    description: "Retrieves users based on the provided room UUID",
  })
  @ApiOkResponse({
    description: "A 200 response if the users are found successfully",
    type: User,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the user doesn't exist",
    type: NotFoundResponse,
  })
  @Get("room/:roomId")
  async findRoomsUsers(@Param("roomId") roomId: string) {
    return await this.usersService.findByRoom(roomId);
  }

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
  async deleteMe(@GetCurrentUser() user: User): Promise<IResponseStatus> {
    return await this.usersService.deleteUser(user.uuid);
  }

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
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<IResponseStatus> {
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

  @ApiOperation({
    summary: "Update current user's password",
    description: "Updates the password of the currently logged-in user",
  })
  @ApiOkResponse({
    description: "A 200 response if the password is updated successfully",
  })
  @ApiUnprocessableEntityResponse({
    description: "A 422 error if the user is not found",
    type: UnprocessableEntityResponse,
  })
  @ApiBadRequestResponse({
    description: "A 400 error if the passwords do not match or the new password is invalid",
    type: BadRequestResponse,
  })
  @Patch("me/password")
  async updateMyPassword(
    @GetCurrentUser() user: User,
    @Body() body: ResetPasswordDto,
  ): Promise<void> {
    return await this.usersService.updatePassword(user.uuid, body);
  }
}
