import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { roundDownToNearestHalfHour } from '@common/utils';
import { PageRequest, PageResponse } from '@common/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from '@common/db/entity';
import { LoggerService } from '@common/logger';
import { CacheService } from '@common/cache';
import { Injectable } from '@nestjs/common';
import { NewsDto } from '../dto/news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getTopNews(request: PageRequest): Promise<PageResponse<NewsDto>> {
    const page = request.page;
    const limit = 10;

    const current = new Date();
    const [data, total] = await this.getNewsFromCache(page, current, () => {
      this.logger.log(NewsService.name, 'load top news from db.');
      return this.getTopNewsFromDB(page, limit, current);
    });

    return { data, total, page, limit };
  }

  private async getTopNewsFromDB(
    page: number,
    limit: number,
    date: Date,
  ): Promise<[NewsDto[], number]> {
    const [items, total] = await this.newsRepository.findAndCount({
      where: {
        publishedAt: LessThan(date),
        image: Not(IsNull()),
      },
      order: {
        publishedAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data: NewsDto[] = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.description,
        publishedAt: item.publishedAt,
      };
    });

    return [data, total];
  }

  private async getNewsFromCache(
    page: number,
    date: Date,
    fn: () => Promise<[NewsDto[], number]>,
  ): Promise<[NewsDto[], number]> {
    const halfHrTime = roundDownToNearestHalfHour(date).getTime();
    const key = `news-top-${page}-${halfHrTime}`;
    const ttl = 4 * 60 * 60 * 1000; // 4 hours

    return this.cacheService.wrap(key, fn, ttl);
  }
}
