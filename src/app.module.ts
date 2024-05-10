import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@common/config/config.module';
import { HealthModule } from './health/health.module';
import { LoggerMiddleware } from 'nestjs-http-logger';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { LoggerModule } from '@common/logger';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      // No more than 3 calls in a second.
      {
        ttl: 1000,
        limit: 3,
      },
    ]),
    ConfigModule,
    DatabaseModule,
    CacheModule,
    LoggerModule.forRoot({ appName: 'pf-api' }),
    AuthModule,
    AdminModule,
    HealthModule,
    NewsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
