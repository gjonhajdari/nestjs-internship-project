import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import loggerInstance from './services/logger/winstonLogger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance: loggerInstance }),
  });

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Nestjs Node v18 Starter')
      .setDescription('Nestjs Node v18 Starter API Documentation')
      .setVersion('1.0')
      .addTag('Node v18')
      .addBearerAuth()
      .addBasicAuth()

      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(port);
}

bootstrap()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(
      `🚀 Server started at http://localhost:${port}\n🚨️ Environment: ${process.env.NODE_ENV}`,
    );
  })
  .catch(() => {
    // eslint-disable-next-line no-console
    console.log(`Server could not be started at http://localhost:${port}`);
  });
