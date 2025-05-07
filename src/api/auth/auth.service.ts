import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  compareHashedDataArgon,
  compareHashedDataBcrypt,
  hashDataArgon,
  hashDataBrypt,
} from "../../services/providers";
import { User } from "../user/entities/user.entity";
import { jwtConstants } from "./constants/constants";
import { LoginDto } from "./dtos/login.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { RegisterDTO } from "./dtos/register.dto";
import { IAuthService } from "./interfaces/auth.service.interface";
import { JwtPayload } from "./interfaces/jwt-payload.inteface";
import { Tokens } from "./types/tokens.types";
import { TTokensUser } from "./types/user-tokens.type";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}

  /**
   * Creates a new user, saves it in the database and returns the access and refresh tokens
   *
   * @param registerDto - The required data to create a user
   * @returns Promise that resolves to the access and refresh tokens
   * @throws {InternalServerErrorException} - If user registration fails
   */
  async signup(registerDto: RegisterDTO): Promise<Tokens> {
    registerDto.password = await hashDataBrypt(registerDto.password);
    delete registerDto.passwordConfirm;

    // const userRoleKey = UserRoles[registerDto.role];
    // const userPermissions = RolePermissions[userRoleKey];

    try {
      const user = await this.userRepository.save(
        this.userRepository.create({
          ...registerDto,
          // permissions: userPermissions,
        }),
      );
      const tokens = await this.getTokens(user.uuid);
      await this.updateRtHash(user.uuid, tokens.refreshToken);
      return tokens;
    } catch (_error) {
      throw new InternalServerErrorException("User registration failed");
    }
  }

  /**
   * Logs in a user and returns the tokens and user object
   *
   * @param loginDto - The required data to log in a user
   * @returns Promise that resolves to the access & refresh tokens, and the user object
   * @throws {BadRequestException} - If user does not exist
   * @throws {BadRequestException} - If user credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<TTokensUser> {
    const user: User = await this.userRepository.findOneBy({
      email: loginDto.email,
    });
    if (!user) {
      throw new BadRequestException("Wrong credentials!");
    }

    const isMatch = await compareHashedDataBcrypt(loginDto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException("Wrong credentials!");
    }

    const tokens = await this.getTokens(user.uuid);
    await this.updateRtHash(user.uuid, tokens.refreshToken);
    return { ...tokens, user };
  }

  /**
   * Logs out a user by removing the refresh token from the database
   *
   * @param userId - The unique UUID of the user
   * @throws {ForbiddenException} - If user does not exist
   */
  async logout(userId: string): Promise<void> {
    const user: User = await this.validateUser(userId);
    user.hashedRefreshToken = null;
    await this.userRepository.save(user);
  }

  /**
   * Refreshes the access and refresh tokens for a user
   *
   * @param userId - The unique UUID of the user
   * @param rt - The refresh token
   * @returns Promise that resolves to the new access and refresh tokens
   * @throws {ForbiddenException} - If user does not exist or is not logged in
   * @throws {UnauthorizedException} - If refresh token is invalid
   */
  async refreshToken(payload: RefreshTokenDto): Promise<Tokens> {
    const { id } = await this.jwtService.verifyAsync(payload.refreshToken, {
      secret: jwtConstants.refresh_token_secret,
    });

    const user: User = await this.validateUser(id);

    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException();
    }

    const rtMatches = await compareHashedDataArgon(
      payload.refreshToken,
      user.hashedRefreshToken,
    );

    if (!rtMatches) {
      throw new UnauthorizedException();
    }

    const tokens: Tokens = await this.getTokens(user.uuid);
    await this.updateRtHash(user.uuid, tokens.refreshToken);
    return tokens;
  }

  /**
   * Validates a user by checking if the user exists in the database
   *
   * @param userId - The unique UUID of the user
   * @returns Promise that resolves to the found user
   */
  private async validateUser(userId: string): Promise<User> {
    return await this.userRepository.findOneBy({ uuid: userId });
  }

  /**
   * Updates the refresh token hash for a user
   *
   * @param userId - The unique UUID of the user
   * @param rt - The refresh token
   */
  private async updateRtHash(userId: string, rt: string): Promise<void> {
    const newHashRt = await hashDataArgon(rt);
    const user = await this.validateUser(userId);
    user.hashedRefreshToken = newHashRt;
    await this.userRepository.save(user);
  }

  /**
   * Generates access and refresh tokens for a user
   *
   * @param userId - The unique UUID of the user
   * @returns Promise that resolves to the access and refresh tokens
   */
  async getTokens(userId: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      id: userId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: jwtConstants.access_token_secret,
        expiresIn: process.env.AT_TOKEN_EXPIRATION_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: jwtConstants.refresh_token_secret,
        expiresIn: process.env.RT_TOKEN_EXPIRATION_TIME,
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
