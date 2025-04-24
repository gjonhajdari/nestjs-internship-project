import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "../../common/decorators/get-current-user-id.decorator";
import { GetCurrentUser } from "../../common/decorators/get-current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RefreshTokenGuard } from "../../common/guards/refresh-token.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDTO } from "./dtos/register.dto";
import { IAuthController } from "./interfaces/auth.controller.interface";
import { TGetCurrentUser } from "./types";
import { Tokens } from "./types/tokens.types";

@ApiBearerAuth()
@ApiTags("Auth")
@UsePipes(new ValidationPipe())
@UseInterceptors(ClassSerializerInterceptor)
@Controller("auth")
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDTO): Promise<Tokens> {
    return await this.authService.signup(registerDto);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: string): Promise<void> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post("token")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@GetCurrentUser() user: TGetCurrentUser): Promise<Tokens> {
    return await this.authService.refreshToken(user.id, user.refreshToken);
  }
}
