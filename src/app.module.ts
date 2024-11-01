import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HmacMiddleware } from './auth/middleware/hmac.middleware';
import { ConfigModule, DatabaseModule } from '@pulsefeed/common';
import { CategoryModule } from './category/category.module';
import { LanguageModule } from './language/language.module';
import { ArticleModule } from './article/article.module';
import { SourceModule } from './source/source.module';
import { LoggerMiddleware } from 'nestjs-http-logger';
import { AdminModule } from './admin/admin.module';
import { LoggerModule } from '@pulsefeed/common';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@pulsefeed/common';
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
    ArticleModule,
    SourceModule,
    CategoryModule,
    LanguageModule,
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
    consumer
      .apply(HmacMiddleware)
      .exclude({
        path: '/v1/admin/(.*)',
        method: RequestMethod.ALL,
      })
      .forRoutes('*');
  }
}
