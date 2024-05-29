import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Set transform to true to allow default value in dto.
      transformOptions: { enableImplicitConversion: true }, // Convert query params to target type.
      forbidNonWhitelisted: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const config = new DocumentBuilder()
    .setTitle('Pulsefeed')
    .setDescription('Pulsefeed API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Check admin secret key is set.
  const configService = app.get(ConfigService);
  const adminKey = configService.get<string>('ADMIN_SECRET_KEY');
  if (!adminKey) {
    console.error('REQUIRED_ENV_VAR is not set. Exiting application.');
    process.exit(1); // Exit the process with an error code
  }

  await app.listen(3000, '0.0.0.0');

  logger.log(`Listening on ${await app.getUrl()}`);
  logger.log(`Swagger running on ${await app.getUrl()}/docs`);
}

bootstrap().then();
