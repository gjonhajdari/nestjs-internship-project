import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {}

  readonly fromEmail: string = process.env.SENDER_MAIL;
  readonly FRONT_APP_URL: string = process.env.APP_URL;

  public forgotPassword(userToken: any) {
    this.mailerService
      .sendMail({
        to: userToken.user,
        from: this.getFromEmail(),
        subject: this.getSubject(`Reset Password`),
        template: this.getEmailTemplatePath('forgotPassword'),
        context: {
          user: userToken.user,
          link: `${this.FRONT_APP_URL}/user/reset/${userToken.token}`,
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
