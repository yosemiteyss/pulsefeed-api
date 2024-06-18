import { ArticleCategoryModule } from './category/article-category.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@common/config/config.module';
import { ArticleModule } from './article/article.module';
import { HealthModule } from './health/health.module';
import { SourceModule } from './source/source.module';
import { LoggerMiddleware } from 'nestjs-http-logger';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from '@common/logger';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      // No more than 5 calls in a second.
      {
        ttl: 1000,
        limit: 5,
      },
    ]),
    ConfigModule,
    DatabaseModule,
    CacheModule,
    LoggerModule.forRoot({ appName: 'pf-api' }),
    AuthModule,
    AdminModule,
    HealthModule,
    ArticleModule,
    SourceModule,
    ArticleCategoryModule,
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
