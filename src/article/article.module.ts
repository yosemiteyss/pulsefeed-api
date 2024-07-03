import { ShuffleService } from '../shared/service/shuffle.service';
import { LanguageModule } from '../language/language.module';
import { CategoryModule } from '../category/category.module';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule, CategoryModule, LanguageModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, ShuffleService],
})
export class ArticleModule {}
