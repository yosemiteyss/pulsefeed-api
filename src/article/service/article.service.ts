import { roundDownToNearestHalfHour, shuffle, stringToEnum } from '@common/utils';
import { ArticleRequestDto } from '../dto/article-request.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { SourceDto } from '../../source/dto/source.dto';
import { ArticleCategoryEnum } from '@common/model';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDto } from '../dto/article.dto';
import { LoggerService } from '@common/logger';
import { LessThan, Repository } from 'typeorm';
import { CacheService } from '@common/cache';
import { PageResponse } from '@common/dto';
import { ArticleEntity } from '@common/db';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getArticles({ category, page }: ArticleRequestDto): Promise<PageResponse<ArticleDto>> {
    const categoryEnum = stringToEnum(ArticleCategoryEnum, category);
    if (!categoryEnum) {
      this.logger.warn(ArticleService.name, `category: ${category} is not found`);
      throw new NotFoundException();
    }

    const limit = DEFAULT_PAGE_SIZE;
    const currentDate = new Date();

    const [data, total] = await this.getCachedArticles(page, categoryEnum, currentDate, () => {
      this.logger.log(ArticleService.name, 'load top articles from db.');
      return this.getFilteredArticlesFromDb(page, limit, currentDate, categoryEnum);
    });

    return { data, total, page, limit };
  }

  /**
   * Get cached articles.
   * Articles are cached every half hour.
   */
  private async getCachedArticles(
    page: number,
    category: ArticleCategoryEnum,
    beforeDate: Date,
    fn: () => Promise<[ArticleDto[], number]>,
  ): Promise<[ArticleDto[], number]> {
    const halfHrTime = roundDownToNearestHalfHour(beforeDate).getTime();
    const key = `articles-${category}-${page}-${halfHrTime}`;
    const ttl = 4 * 60 * 60 * 1000; // 4 hours

    return this.cacheService.wrap(key, fn, ttl);
  }

  /**
   * Get filtered articles from database.
   */
  private async getFilteredArticlesFromDb(
    page: number,
    limit: number,
    beforeDate: Date,
    category: ArticleCategoryEnum,
  ): Promise<[ArticleDto[], number]> {
    const [items, total] = await this.articleRepository.findAndCount({
      relations: {
        source: true,
        category: true,
      },
      where: {
        publishedAt: LessThan(beforeDate),
        source: {
          enabled: true,
        },
        category: {
          key: category,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    let data: ArticleDto[] = items.map((item) => {
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

    data = this.shuffleArticlesByAlternatedSource(data);

    return [data, total];
  }

  private shuffleArticlesByAlternatedSource(articles: ArticleDto[]): ArticleDto[] {
    // Group articles by source
    const articlesBySource: { [key: string]: ArticleDto[] } = {};

    articles.forEach((article) => {
      const sourceKey = article.source?.id || 'unknown';
      if (!articlesBySource[sourceKey]) {
        articlesBySource[sourceKey] = [];
      }
      articlesBySource[sourceKey].push(article);
    });

    // Shuffle each group using Fisher-Yates algorithm
    const shuffledGroups = Object.values(articlesBySource).map((group) => shuffle(group));

    // Interleave the shuffled groups
    const result: ArticleDto[] = [];
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
