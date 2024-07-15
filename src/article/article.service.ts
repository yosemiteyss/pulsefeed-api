import { ArticleListRequestDto } from './dto/article-list-request.dto';
import { ArticleRepository } from './repository/article.repository';
import { ShuffleService } from '../shared/service/shuffle.service';
import { ArticleFindOptions } from './type/article-find-options';
import { LanguageService } from '../language/language.service';
import { CategoryService } from '../category/category.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { roundDownToNearestHalfHour } from '@common/utils';
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
    private readonly languageService: LanguageService,
    private readonly categoryService: CategoryService,
  ) {}

  private useCache = true;

  async getArticles({
    category,
    language,
    sourceId,
    page,
  }: ArticleListRequestDto): Promise<PageResponse<ArticleDto>> {
    if (!this.categoryService.isSupportedCategory(category)) {
      this.logger.warn(ArticleService.name, `category: ${category} is not found`);
      throw new NotFoundException();
    }

    if (!this.languageService.isSupportedLanguage(language)) {
      this.logger.warn(ArticleService.name, `language: ${language} is not found`);
      throw new NotFoundException();
    }

    const limit = DEFAULT_PAGE_SIZE;
    const currentDate = new Date();

    const opts: ArticleFindOptions = {
      page,
      limit,
      category,
      language,
      sourceId,
      publishedBefore: currentDate,
    };

    let data: ArticleDto[];
    let total: number;

    if (this.useCache) {
      [data, total] = await this.getCachedArticles(opts, () => {
        this.logger.log(ArticleService.name, 'Load articles from db.');
        return this.getFilteredArticlesFromDb(opts);
      });
    } else {
      this.logger.log(ArticleService.name, 'Load articles from db.');
      [data, total] = await this.getFilteredArticlesFromDb(opts);
    }

    return { data, total, page, limit };
  }

  /**
   * Get cached articles.
   * Articles are cached every half hour.
   */
  private async getCachedArticles(
    { category, language, sourceId, page, publishedBefore }: ArticleFindOptions,
    onCacheMissed: () => Promise<[ArticleDto[], number]>,
  ): Promise<[ArticleDto[], number]> {
    let baseKey = `pf:articles:${category}-${language}`;

    // Append source id.
    if (sourceId) {
      baseKey = `${baseKey}-${sourceId}`;
    }

    // Append page
    baseKey = `${baseKey}-${page}`;

    // Append published before
    const nearestHalfHr = roundDownToNearestHalfHour(publishedBefore).getTime();
    baseKey = `${baseKey}-${nearestHalfHr}`;

    const ttl = 4 * 60 * 60 * 1000; // 4 hours
    return this.cacheService.wrap(baseKey, onCacheMissed, ttl);
  }

  /**
   * Get filtered articles from database.
   */
  private async getFilteredArticlesFromDb(
    opts: ArticleFindOptions,
  ): Promise<[ArticleDto[], number]> {
    const [items, total] = await this.articleRepository.getArticles(opts);

    let data: ArticleDto[] = items.map(({ article, source }) => {
      return {
        id: article.id,
        title: article.title,
        description: article.description,
        image: article.image,
        link: article.link,
        publishedAt: article.publishedAt ?? article.createdAt,
        source: SourceDto.fromModel(source),
      };
    });

    data = this.shuffleService.shuffleByKey(data, (article) => article.source?.id || 'unknown');

    return [data, total];
  }
}
