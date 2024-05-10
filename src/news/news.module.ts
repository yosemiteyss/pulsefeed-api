import { NewsService } from './service/news.service';
import { NewsController } from './news.controller';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
