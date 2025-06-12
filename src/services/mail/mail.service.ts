import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable } from "@nestjs/common";
import { EmailWithToken } from "../../common/interfaces/EmailWithToken.interface";

@Injectable()
export class MailService {
  constructor(@Inject(MailerService) private readonly mailerService: MailerService) {}

  readonly fromEmail: string = process.env.SENDER_MAIL;
  readonly FRONT_APP_URL: string = process.env.FRONT_APP_URL;

  public forgotPassword(payload: EmailWithToken) {
    this.mailerService
      .sendMail({
        to: payload.user.email,
        from: this.getFromEmail(),
        subject: this.getSubject("Reset Password"),
        template: this.getEmailTemplatePath("forgotPassword"),
        context: {
          name: payload.user.firstName,
          link: `${this.FRONT_APP_URL}/reset-password?token=${payload.token}&name=${payload.user.firstName}`,
        },
      })
      .then((data) => data)
      .catch((error) => {
        throw error;
      });
  }

  public getEmailTemplatePath(template_name) {
    return `email/${template_name}`;
  }

  public getSubject(subject) {
    return subject;
  }

  private getFromEmail() {
    return this.fromEmail;
  }
}
