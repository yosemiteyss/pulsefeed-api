import { INestApplication, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Set transform to true to allow default value in dto.
      transformOptions: { enableImplicitConversion: true }, // Convert query params to target type.
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableShutdownHooks();

  // Setup swagger document.
  const configService = app.get(ConfigService);
  if (configService.get('NODE_ENV') === 'development') {
    const config = new DocumentBuilder().setTitle('pf-api').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(3000, '0.0.0.0');
  await printRegisteredRoutes(app);
}

async function printRegisteredRoutes(app: INestApplication) {
  const logger = new Logger('bootstrap');
  const server = app.getHttpServer();
  const router = server._events.request._router;

  logger.log(`Listening on ${await app.getUrl()}`);
  logger.log(`Swagger running on ${await app.getUrl()}/docs`);
  logger.log('Registered routes:');
  router.stack
    .filter((layer) => layer.route) // Filter out middleware
    .map((layer) => {
      const route = layer.route;
      const methods = Object.keys(route.methods).join(', ').toUpperCase();
      logger.log(`[${methods}] ${route.path}`);
    });
}

bootstrap().then();
