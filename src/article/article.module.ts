import { ArticleCategoryRepository, LanguageRepository } from '@pulsefeed/common';
import { ArticleFeedBuilder, ArticleService } from './service';
import { ArticleRepository } from './repository';
import { ArticleController } from './controller';
import { ShuffleService } from '../shared';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleRepository,
    ArticleCategoryRepository,
    LanguageRepository,
    ShuffleService,
    ArticleFeedBuilder,
  ],
})
export class ArticleModule {}
