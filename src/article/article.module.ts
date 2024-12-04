import { DatabaseModule, CacheModule } from '@pulsefeed/common';
import { ArticleRepository, ArticleMapper } from './repository';
import { ArticleService } from './service/article.service';
import { ArticleController } from './article.controller';
import { LanguageModule } from '../language';
import { CategoryModule } from '../category';
import { ShuffleService } from '../shared';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule, CategoryModule, LanguageModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, ArticleMapper, ShuffleService],
  exports: [ArticleService],
})
export class ArticleModule {}
