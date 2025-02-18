import { TrendingDataModule } from '../trending-data';
import { TrendingController } from './controller';
import { TrendingService } from './service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TrendingDataModule],
  controllers: [TrendingController],
  providers: [TrendingService],
})
export class TrendingModule {}
