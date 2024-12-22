import {
  ConfigModule,
  DatabaseModule,
  LoggerModule,
  CacheModule,
  ONE_SECOND_IN_MS,
} from '@pulsefeed/common';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { HmacMiddleware, AuthModule, LocalhostRestrictMiddleware } from './auth';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerMiddleware } from 'nestjs-http-logger';
import { CategoryModule } from './category';
import { LanguageModule } from './language';
import { ArticleModule } from './article';
import { APP_GUARD } from '@nestjs/core';
import { SourceModule } from './source';
import { AdminModule } from './admin';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: ONE_SECOND_IN_MS, limit: 100 }]),
    ConfigModule,
    DatabaseModule,
    CacheModule,
    LoggerModule.forRootAsync(),
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
      .apply(LocalhostRestrictMiddleware)
      .forRoutes({ path: '/v1/admin/(.*)', method: RequestMethod.ALL });
    consumer
      .apply(HmacMiddleware)
      .exclude({
        path: '/v1/admin/(.*)',
        method: RequestMethod.ALL,
      })
      .forRoutes('*');
  }
}
