import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";

// example test
describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue({})
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
