import { TrendingKeywordsRepository } from '@pulsefeed/common';
import { TrendingController } from './controller';
import { TrendingService } from './service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TrendingController],
  providers: [TrendingService, TrendingKeywordsRepository],
})
export class TrendingModule {}
