import { ArticleRepository } from './repository/article.repository';
import { ShuffleService } from '../shared/service/shuffle.service';
import { LanguageModule } from '../language/language.module';
import { CategoryModule } from '../category/category.module';
import { ArticleMapper } from './repository/article.mapper';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { DatabaseModule } from '@pulsefeed/common';
import { CacheModule } from '@pulsefeed/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule, CategoryModule, LanguageModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, ArticleMapper, ShuffleService],
  exports: [ArticleService],
})
export class ArticleModule {}
