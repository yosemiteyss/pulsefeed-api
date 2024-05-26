import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
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

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Pulsefeed')
    .setDescription('Pulsefeed API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const APP_PORT = 3001;
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  setupApp(app);
  setupSwagger(app);

  // Check admin secret key is set.
  const configService = app.get(ConfigService);
  const adminKey = configService.get<string>('ADMIN_SECRET_KEY');
  if (!adminKey) {
    console.error('REQUIRED_ENV_VAR is not set. Exiting application.');
    process.exit(1); // Exit the process with an error code
  }

  await app.listen(APP_PORT, '0.0.0.0');

  logger.log(`Listening on ${await app.getUrl()}`);
  logger.log(`Swagger running on ${await app.getUrl()}/docs`);
}

bootstrap().then();
