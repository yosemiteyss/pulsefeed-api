import { DatabaseModule, CacheModule } from '@pulsefeed/common';
import { ArticleRepository } from './repository';
import { ArticleController } from './controller';
import { ArticleService } from './service';
import { LanguageModule } from '../language';
import { CategoryModule } from '../category';
import { ShuffleService } from '../shared';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule, CategoryModule, LanguageModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, ShuffleService],
})
export class ArticleModule {}
