import { ArticleFeedBuilder, ArticleService } from './service';
import { TrendingDataModule } from '../trending-data';
import { RepositoryModule } from '@pulsefeed/common';
import { ArticleDataModule } from '../article-data';
import { ArticleController } from './controller';
import { ShuffleService } from '../shared';
import { Module } from '@nestjs/common';

@Module({
  imports: [RepositoryModule, ArticleDataModule, TrendingDataModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleFeedBuilder, ShuffleService],
})
export class ArticleModule {}
