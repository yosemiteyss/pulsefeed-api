import { NewsController } from './controller/news.controller';
import { NewsService } from './service/news.service';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
