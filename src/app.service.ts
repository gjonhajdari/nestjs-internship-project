import { EventEmitter } from "node:stream";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectEventEmitter } from "nest-emitter";
import { VerifyMail } from "./api/auth/interfaces/verify-mail.interface";
import { MailService } from "./services/mail/mail.service";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: EventEmitter,
    private readonly mailService: MailService,
  ) {}

  getHello(): string {
    return "Hello World!";
  }

  onModuleInit(): any {
    this.emitter.on(
      "forgotPasswordMail",
      async (payload) => await this.onForgotPasswordMail(payload),
    );

    this.emitter.on(
      "verifyMail",
      async (payload: VerifyMail) => await this.onVerifyMail(payload),
    );
  }

  private async onForgotPasswordMail(payload: any) {
    this.mailService.forgotPassword(payload);
  }

  private async onVerifyMail(payload: VerifyMail) {
    this.mailService.verifyEmail(payload);
  }
}
