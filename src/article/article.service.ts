import { roundDownToNearestHalfHour, stringToEnum } from '@common/utils';
import { ShuffleService } from '../shared/service/shuffle.service';
import { ArticleCategoryEnum, LanguageEnum } from '@common/model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRequestDto } from './dto/article-request.dto';
import { ArticleRepository } from './article.repository';
import { DEFAULT_PAGE_SIZE } from '../shared/constants';
import { SourceDto } from '../source/dto/source.dto';
import { ArticleDto } from './dto/article.dto';
import { LoggerService } from '@common/logger';
import { CacheService } from '@common/cache';
import { PageResponse } from '@common/dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
    private readonly shuffleService: ShuffleService,
  ) {}

  async getArticles({
    category,
    language,
    page,
  }: ArticleRequestDto): Promise<PageResponse<ArticleDto>> {
    const categoryEnum = stringToEnum(ArticleCategoryEnum, category);
    if (!categoryEnum) {
      this.logger.warn(ArticleService.name, `category: ${category} is not found`);
      throw new NotFoundException();
    }

    const languageEnum = stringToEnum(LanguageEnum, language);
    if (!languageEnum) {
      this.logger.warn(ArticleService.name, `language: ${language} is not found`);
      throw new NotFoundException();
    }

    const limit = DEFAULT_PAGE_SIZE;
    const currentDate = new Date();

    const [data, total] = await this.getCachedArticles(
      page,
      categoryEnum,
      languageEnum,
      currentDate,
      () => {
        this.logger.log(ArticleService.name, 'load top articles from db.');
        return this.getFilteredArticlesFromDb(page, limit, categoryEnum, languageEnum, currentDate);
      },
    );

    return { data, total, page, limit };
  }

  /**
   * Get cached articles.
   * Articles are cached every half hour.
   */
  private async getCachedArticles(
    page: number,
    category: ArticleCategoryEnum,
    language: LanguageEnum,
    publishedBefore: Date,
    onCacheMissed: () => Promise<[ArticleDto[], number]>,
  ): Promise<[ArticleDto[], number]> {
    const halfHrTime = roundDownToNearestHalfHour(publishedBefore).getTime();
    const key = `articles-${category}-${language}-${page}-${halfHrTime}`;
    const ttl = 4 * 60 * 60 * 1000; // 4 hours

    return this.cacheService.wrap(key, onCacheMissed, ttl);
  }

  /**
   * Get filtered articles from database.
   */
  private async getFilteredArticlesFromDb(
    page: number,
    limit: number,
    category: ArticleCategoryEnum,
    language: LanguageEnum,
    publishedBefore: Date,
  ): Promise<[ArticleDto[], number]> {
    const [items, total] = await this.articleRepository.find({
      page,
      limit,
      category,
      language,
      publishedBefore,
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

    data = this.shuffleService.shuffleByKey(data, (article) => article.source?.id || 'unknown');

    return [data, total];
  }
}
