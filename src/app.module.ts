import { EventEmitter } from "node:stream";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NestEmitterModule } from "nest-emitter";
import { DataSourceOptions } from "typeorm";
import { ActivitiesModule } from "./api/activities/activities.module";
import { AuthModule } from "./api/auth/auth.module";
import { CommentsModule } from "./api/comments/comments.module";
import { NotesModule } from "./api/notes/notes.module";
import { RoomsModule } from "./api/rooms/rooms.module";
import { UserModule } from "./api/user/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { config } from "./common/db/dataSource/data-source.config";
import { AccessTokenGuard } from "./common/guards/access-token.guard";
import { MailService } from "./services/mail/mail.service";

@Module({
  imports: [
    TypeOrmModule.forRoot(config as DataSourceOptions),
    ConfigModule.forRoot({
      envFilePath: [".env"],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_AUTH_USER,
          pass: process.env.MAIL_AUTH_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SENDER_MAIL,
      },
      template: {
        dir: `${__dirname}/../templates`,
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    NestEmitterModule.forRoot(new EventEmitter()),
    AuthModule,
    UserModule,
    RoomsModule,
    NotesModule,
    CommentsModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    AppService,
    MailService,
    Logger,
  ],
})
export class AppModule {}
