import { ArticleController } from './controller/article.controller';
import { ArticleService } from './service/article.service';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
