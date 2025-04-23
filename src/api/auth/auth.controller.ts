import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { AtGuard } from '../../common/guards/at.guard';
import { RtGuard } from '../../common/guards/rt.guard';
import { RegisterDTO } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Tokens } from './types/tokens.types';
import { IAuthController } from './interfaces/auth.controller.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TGetCurrentUser } from './types';

@ApiBearerAuth()
@ApiTags('Auth')
@UsePipes(new ValidationPipe())
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDTO): Promise<Tokens> {
    return await this.authService.signup(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: string): Promise<void> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@GetCurrentUser() user: TGetCurrentUser): Promise<Tokens> {
    return await this.authService.refreshToken(user.id, user.refreshToken);
  }
}
