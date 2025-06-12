import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { UnprocessableEntityResponse } from "src/common/interfaces/responses/unprocessable-entity.response";
import { EmailValidationPipe } from "src/common/pipes/email-validation.pipe";
import { GetCurrentUser } from "../../common/decorators/get-current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { BadRequestResponse } from "../../common/interfaces/responses/bad-request.response";
import { ForbiddenResponse } from "../../common/interfaces/responses/forbidden.response";
import { InternalErrorResponse } from "../../common/interfaces/responses/internal-error.response";
import { LoginUserResponse } from "../../common/interfaces/responses/login-user.respons";
import { UnauthorizedResponse } from "../../common/interfaces/responses/unauthorized.response";
import { UserTokensResponse } from "../../common/interfaces/responses/user-tokens.response";
import { User } from "../user/entities/user.entity";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { RegisterDTO } from "./dtos/register.dto";
import { VerifyEmailDto } from "./dtos/verify-email.dto";
import { IAuthController } from "./interfaces/auth.controller.interface";
import { Tokens } from "./types/tokens.types";
import { TTokensUser } from "./types/user-tokens.type";

@ApiBearerAuth()
@ApiTags("Auth")
@UsePipes(new ValidationPipe())
@UseInterceptors(ClassSerializerInterceptor)
@Controller("auth")
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Register a new user",
    description: "Registers a new user and sends a verification code to the user's email.",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the user is registered successfully",
    type: UserTokensResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "A 500 error if the user registration fails",
    type: InternalErrorResponse,
  })
  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDTO): Promise<Tokens> {
    return await this.authService.signup(registerDto);
  }

  @ApiOperation({
    summary: "Login as a user",
    description: "Logs in a user and returns access and refresh tokens.",
  })
  @ApiOkResponse({
    description: "A 200 response if the user is logged in successfully",
    type: LoginUserResponse,
  })
  @ApiBadRequestResponse({
    description: "A 400 error if the user credentials are invalid",
    type: BadRequestResponse,
  })
  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: "Log out as a user",
    description: "Logs out a user by invalidating their refresh token.",
  })
  @UseGuards(AccessTokenGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUser() user: User): Promise<void> {
    return this.authService.logout(user.uuid);
  }

  @ApiOperation({
    summary: "Refresh user tokens",
    description: "Refreshes the access token using the refresh token.",
  })
  @ApiOkResponse({
    description: "A 200 response if the refresh token is valid",
    type: UserTokensResponse,
  })
  @ApiForbiddenResponse({
    description: "A 403 error if the user doesn't exist or is not logged in",
    type: ForbiddenResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if the refresh token is invalid",
    type: UnauthorizedResponse,
  })
  @Public()
  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenDto): Promise<Tokens> {
    return await this.authService.refreshToken(body);
  }

  @ApiOperation({
    summary: "Verify user email",
    description: "Verifies a user's email address using a verification code.",
  })
  @ApiOkResponse({
    description: "A 200 response if the email is verified successfully",
    type: LoginUserResponse,
  })
  @ApiBadRequestResponse({
    description: "A 400 error if the user doesn't exist or verification code is invalid",
    type: BadRequestResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: "A 422 error if the verification code is expired",
    type: UnprocessableEntityResponse,
  })
  @Public()
  @Post("verify-email/:email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Param("email", EmailValidationPipe) email: string,
    @Body() body: VerifyEmailDto,
  ): Promise<TTokensUser> {
    return this.authService.verifyEmail(email, body.code);
  }

  @ApiOperation({
    summary: "Resend verification email",
    description: "Sends a new verification email to the user.",
  })
  @ApiOkResponse({
    description: "A 200 response if the verification email is sent successfully",
  })
  @ApiBadRequestResponse({
    description: "A 400 error if the user doesn't exist or is already verified",
    type: BadRequestResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: "A 422 error if there was an issue processing the request",
    type: UnprocessableEntityResponse,
  })
  @Public()
  @Post("resend-verification/:email")
  @HttpCode(HttpStatus.OK)
  async resendVerifyEmail(@Param("email", EmailValidationPipe) email: string): Promise<void> {
    return this.authService.sendVerificationEmail(email);
  }
}
