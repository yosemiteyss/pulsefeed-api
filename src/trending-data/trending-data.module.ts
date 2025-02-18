import { RepositoryModule } from '@pulsefeed/common';
import { ArticleDataModule } from '../article-data';
import { TrendingDataService } from './service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RepositoryModule, ArticleDataModule],
  providers: [TrendingDataService],
  exports: [TrendingDataService],
})
export class TrendingDataModule {}
