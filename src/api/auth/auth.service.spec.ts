import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { RegisterDTO } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { HttpException } from '@nestjs/common';
import { UserGender } from '../user/enums/userGender.enum';
import { UserRoles } from '../user/enums/roles.enum';

jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    signAsync: jest.fn().mockResolvedValue('token'),
  })),
}));

jest.mock('../../services/providers', () => ({
  hashDataBrypt: jest.fn().mockResolvedValue('hashed-password'),
  compareHashedDataBcrypt: jest.fn().mockResolvedValue(true),
  hashDataArgon: jest.fn().mockResolvedValue('hashed-refresh-token'),
  compareHashedDataArgon: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('signup', () => {
    it('should return tokens if signup is successful', async () => {
      const user: RegisterDTO = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        username: 'testuser',
        password: 'password',
        passwordConfirm: 'password',
        gender: UserGender.MALE,
        phone: '',
        timezone: '',
        role: UserRoles.USER,
      };

      const token = {
        accessToken: 'token',
        refreshToken: 'token',
      };

      jest
        .spyOn(authService, 'signup')
        .mockImplementation(() => Promise.resolve(token));

      const tokens = await authService.signup(user);
      expect(tokens).toBe(token);
    });

    it('should throw HttpException if signup fails', async () => {
      const user: RegisterDTO = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        username: 'testuser',
        password: 'password',
        passwordConfirm: 'password',
        gender: UserGender.MALE,
        phone: '',
        timezone: '',
        role: UserRoles.USER,
      };

      jest.spyOn(userRepository, 'save').mockImplementationOnce(() => {
        return Promise.reject(new Error());
      });

      try {
        await authService.signup(user);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('User registration failed');
      }
    });
  });
});
