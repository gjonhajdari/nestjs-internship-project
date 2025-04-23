import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { RegisterDTO } from './dtos/register.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    jest.useFakeTimers();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ValidationPipe],
    })
      .overrideProvider(AuthService)
      .useValue({
        signup: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })
      .compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should return the result of authService.signup', async () => {
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(tokens);

      const registerDto = new RegisterDTO();
      registerDto.firstName = 'First Name';
      registerDto.lastName = 'Last Name';
      registerDto.username = 'username';
      registerDto.email = 'email';
      registerDto.password = 'password';
      registerDto.passwordConfirm = 'password';

      expect(await authController.register(registerDto)).toBe(tokens);
    });
  });

  describe('login', () => {
    it('should return the result of authService.login', async () => {
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(tokens);

      expect(
        await authController.login({
          email: 'test@test.com',
          password: 'password',
        }),
      ).toBe(tokens);
    });
  });

  describe('refreshToken', () => {
    it('should return the result of authService.refreshToken', async () => {
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(authService, 'refreshToken').mockResolvedValue(tokens);

      expect(await authController.refreshToken('userId', 'refreshToken')).toBe(
        tokens,
      );
    });
  });
});
