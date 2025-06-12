import * as crypto from "node:crypto";
import { EventEmitter } from "node:events";
import { tryCatch } from "@maxmorozoff/try-catch-tuple";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectEventEmitter } from "nest-emitter";
import { Repository } from "typeorm";
import {
  compareHashedDataArgon,
  compareHashedDataBcrypt,
  hashDataArgon,
  hashDataBrypt,
} from "../../services/providers";
import { User } from "../user/entities/user.entity";
import { VerifyEmail } from "../user/entities/verify-email.entity";
import { UsersRepository } from "../user/repository/users.repository";
import { jwtConstants } from "./constants/constants";
import { LoginDto } from "./dtos/login.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { RegisterDTO } from "./dtos/register.dto";
import { IAuthService } from "./interfaces/auth.service.interface";
import { JwtPayload } from "./interfaces/jwt-payload.inteface";
import { ValidateOptions } from "./interfaces/validate-options.interface";
import { Tokens } from "./types/tokens.types";
import { TTokensUser } from "./types/user-tokens.type";

@Injectable()
export class AuthService implements IAuthService {
  readonly VERIFICATION_TIME = Number.parseInt(process.env.VERIFICATION_EXPIRATION_MINUTES);

  constructor(
    private userRepository: UsersRepository,

    @InjectRepository(VerifyEmail)
    private verifyEmailRepository: Repository<VerifyEmail>,

    @InjectEventEmitter() private readonly emitter: EventEmitter,

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
    const createdUser = this.userRepository.create({
      ...registerDto,
      // permissions: userPermissions,
    });

    const [user, userError] = await tryCatch(this.userRepository.save(createdUser));

    const tokens = await this.getTokens(user.uuid);
    await this.updateRtHash(user.uuid, tokens.refreshToken);
    await this.sendVerificationEmail(user.uuid);

    return tokens;
  }

  /**
   * Verifies a user's email using the provided code
   *
   * @param payload - The required data to verify a user's email
   * @returns Promise that resolves to the access and refresh tokens, and the user object
   * @throws {BadRequestException} - If user does not exist or is already verified
   * @throws {BadRequestException} - If validation code is invalid
   * @throws {UnprocessableEntityException} - If verification code has expired
   */
  async verifyEmail(email: string, code: number): Promise<TTokensUser> {
    const user = await this.validateUser(email, {
      isVerified: false,
      message: "User does not exist or is already verified",
    });

    const validationCode = await this.verifyEmailRepository.findOne({
      where: { user: { id: user.id }, code: code },
    });

    if (!validationCode) throw new BadRequestException("Invalid validation code");
    if (validationCode.expiresAt < new Date())
      throw new UnprocessableEntityException("Verification code has expired");

    const tokens = await this.getTokens(user.uuid);
    await this.updateRtHash(user.uuid, tokens.refreshToken, true);
    return { ...tokens, user };
  }
  /**
   * Sends a verification email to the user with a verification code
   *
   * @param userId - The unique UUID of the user
   * @throws {BadRequestException} - If user does not exist or is already verified
   */
  async sendVerificationEmail(userId: string): Promise<void> {
    const user = await this.validateUser(userId, {
      isVerified: false,
      message: "User does not exist or is already verified",
    });

    const code = await this.generateVerificationCode(user);

    this.emitter.emit("verifyMail", { code, user });
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
    const user: User = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
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
   * @param identifier - The unique UUID or email of the user
   * @param options - Optional parameters to customize the validation
   * @returns Promise that resolves to the found user
   * @throws {NotFoundException} - If user does not exist
   * @throws {UnprocessableEntityException} - If there was an error processing the request
   */
  private async validateUser(identifier: string, options?: ValidateOptions): Promise<User> {
    const { message, ...whereOptions } = options || {};

    const isEmail = identifier.includes("@");
    const conditions = isEmail
      ? { email: identifier, ...whereOptions }
      : { uuid: identifier, ...whereOptions };

    const [user, error] = await tryCatch(this.userRepository.findOneBy(conditions));

    if (!user) throw new NotFoundException(message ?? "User does not exist");

    if (error)
      throw new UnprocessableEntityException("There was an error processing your request");

    return user;
  }

  /**
   * Updates the refresh token hash for a user
   *
   * @param userId - The unique UUID of the user
   * @param rt - The refresh token
   */
  private async updateRtHash(userId: string, rt: string, verified?: boolean): Promise<void> {
    const newHashRt = await hashDataArgon(rt);
    const user = await this.validateUser(userId);

    user.hashedRefreshToken = newHashRt;
    if (verified) user.isVerified = verified;

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

  /**
   * Generates a verification code for a user and saves it in the database
   *
   * @param userId - The unique UUID of the user
   * @returns Promise that resolves to the generated verification code
   *
   * @throws {InternalServerErrorException} - If there was an error generating the verification code
   */
  async generateVerificationCode(user: User): Promise<number> {
    const code = crypto.randomInt(100000, 999999);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.VERIFICATION_TIME);

    const [_, error] = await tryCatch(
      this.verifyEmailRepository.save(
        this.verifyEmailRepository.create({
          code,
          expiresAt,
          user,
        }),
      ),
    );

    if (error)
      throw new InternalServerErrorException(
        "There was an error generating the verification code",
      );

    return code;
  }
}
