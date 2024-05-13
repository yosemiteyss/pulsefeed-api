import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function setupApp(app: INestApplication) {
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Set transform to true to allow default value in dto.
      transformOptions: { enableImplicitConversion: true }, // Convert query params to target type.
      forbidNonWhitelisted: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
}

async function bootstrap() {
  const APP_PORT = 3001;
  const app = await NestFactory.create(AppModule);
  setupApp(app);

  const config = new DocumentBuilder()
    .setTitle('Pulsefeed')
    .setDescription('Pulsefeed API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT, '0.0.0.0');

  const logger = new Logger('bootstrap');
  logger.log(`Listening on ${await app.getUrl()}`);
  logger.log(`Swagger running on ${await app.getUrl()}/docs`);
}

bootstrap().then();
