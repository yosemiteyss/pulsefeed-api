import { TrendingKeywordsRepository } from '@pulsefeed/common';
import { TrendingController } from './controller';
import { ArticleRepository } from '../article';
import { TrendingService } from './service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TrendingController],
  providers: [TrendingService, TrendingKeywordsRepository, ArticleRepository],
})
export class TrendingModule {}
