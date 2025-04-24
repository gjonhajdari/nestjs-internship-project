import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PasswordReset } from "./entities/reset-password.entity";
import { UserRepository } from "./repository/users.repository";
import { UserService } from "./users.service";

// example test
describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const repository = {};
    const passwordResetRepository = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: repository,
        },
        {
          provide: getRepositoryToken(PasswordReset),
          useValue: passwordResetRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
