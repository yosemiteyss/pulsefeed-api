import { roundDownToNearestHalfHour, shuffle, stringToEnum } from '@common/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { NewsRequestDto } from '../dto/news-request.dto';
import { SourceDto } from '../../source/dto/source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from '@common/db/entity';
import { LoggerService } from '@common/logger';
import { LessThan, Repository } from 'typeorm';
import { CacheService } from '@common/cache';
import { NewsCategory } from '@common/model';
import { PageResponse } from '@common/dto';
import { NewsDto } from '../dto/news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getNews({ category, page }: NewsRequestDto): Promise<PageResponse<NewsDto>> {
    const newsCategory = stringToEnum(NewsCategory, category);
    if (!newsCategory) {
      throw new NotFoundException('Category is not found');
    }

    const limit = DEFAULT_PAGE_SIZE;
    const currentDate = new Date();

    const [data, total] = await this.getCachedNews(page, newsCategory, currentDate, () => {
      this.logger.log(NewsService.name, 'load top news from db.');
      return this.getFilteredNewsFromDb(page, limit, currentDate, newsCategory);
    });

    return { data, total, page, limit };
  }

  /**
   * Get cached news articles.
   * News articles are cached every half hour.
   */
  private async getCachedNews(
    page: number,
    category: NewsCategory,
    beforeDate: Date,
    fn: () => Promise<[NewsDto[], number]>,
  ): Promise<[NewsDto[], number]> {
    const halfHrTime = roundDownToNearestHalfHour(beforeDate).getTime();
    const key = `news-${category}-${page}-${halfHrTime}`;
    const ttl = 4 * 60 * 60 * 1000; // 4 hours

    return this.cacheService.wrap(key, fn, ttl);
  }

  /**
   * Get filtered news articles from database.
   */
  private async getFilteredNewsFromDb(
    page: number,
    limit: number,
    beforeDate: Date,
    category: NewsCategory,
  ): Promise<[NewsDto[], number]> {
    const [items, total] = await this.newsRepository.findAndCount({
      relations: {
        source: true,
      },
      where: {
        publishedAt: LessThan(beforeDate),
        source: {
          enabled: true,
        },
        category: category,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    let data: NewsDto[] = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        link: item.link,
        publishedAt: item.publishedAt ?? item.createdAt,
        source: item.source ? SourceDto.fromEntity(item.source) : undefined,
      };
    });

    data = this.shuffleNewsByAlternatedSource(data);

    return [data, total];
  }

  private shuffleNewsByAlternatedSource(news: NewsDto[]): NewsDto[] {
    // Group news articles by source
    const newsBySource: { [key: string]: NewsDto[] } = {};

    news.forEach((article) => {
      const sourceKey = article.source?.id || 'unknown';
      if (!newsBySource[sourceKey]) {
        newsBySource[sourceKey] = [];
      }
      newsBySource[sourceKey].push(article);
    });

    // Shuffle each group using Fisher-Yates algorithm
    const shuffledGroups = Object.values(newsBySource).map((group) => shuffle(group));

    // Interleave the shuffled groups
    const result: NewsDto[] = [];
    let addedAny: boolean;

    do {
      addedAny = false;
      for (const group of shuffledGroups) {
        if (group.length > 0) {
          result.push(group.shift()!);
          addedAny = true;
        }
      }
    } while (addedAny);

    return result;
  }
}
