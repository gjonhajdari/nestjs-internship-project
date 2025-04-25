import { Controller, Get, Logger, Version } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./common/decorators/public.decorator";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private logger: Logger,
  ) {}

  @Version("1")
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Version("2")
  @Public()
  @Get()
  getHelloV2() {
    return {
      message: `${this.appService.getHello()} from /api/v2`,
    };
  }
}
