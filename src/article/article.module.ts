import { ArticleService } from './service/article.service';
import { ArticleController } from './article.controller';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
