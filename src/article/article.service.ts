import { ArticleListRequestDto } from './dto/article-list-request.dto';
import { ArticleRepository } from './repository/article.repository';
import { ShuffleService } from '../shared/service/shuffle.service';
import { ArticleFindOptions } from './type/article-find-options';
import { HomeFeedRequestDto } from './dto/home-feed-request-dto';
import { LanguageService } from '../language/language.service';
import { CategoryService } from '../category/category.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { roundDownToNearestHalfHour } from '@common/utils';
import { DEFAULT_PAGE_SIZE } from '../shared/constants';
import { SourceDto } from '../source/dto/source.dto';
import { ArticleDto } from './dto/article.dto';
import { LoggerService } from '@common/logger';
import { HomeFeedDto } from './dto/home-feed';
import { CacheService } from '@common/cache';
import { PageResponse } from '@common/dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly logger: LoggerService,
    private readonly shuffleService: ShuffleService,
    private readonly languageService: LanguageService,
    private readonly categoryService: CategoryService,
    private readonly cacheService: CacheService,
  ) {}

  async getHomeFeed({ language, sectionKey }: HomeFeedRequestDto): Promise<HomeFeedDto> {
    const categories = await this.categoryService.getSupportedCategories({ language });
    const topCategories = categories.sort((a, b) => b.priority! - a.priority!).slice(0, 5);

    // Find category section index.
    let index: number;
    if (!sectionKey) {
      index = 0;
    } else {
      index = topCategories.findIndex((category) => category.key === sectionKey);
    }

    const category = topCategories[index];

    const { data } = await this.getArticlesByOpts({
      page: 1,
      limit: 10,
      category: category.key!,
      language: language,
      publishedBefore: ArticleService.getArticleRequestPublishedTime(),
    });

    const nextSection = index + 1 >= topCategories.length ? undefined : topCategories[index + 1];

    this.logger.log(
      ArticleService.name,
      `current index: ${index}, nextSection: ${nextSection?.key}`,
    );

    return {
      section: {
        category: category,
        articles: data,
      },
      nextSectionKey: nextSection?.key,
    };
  }

  async getArticleList(
    request: ArticleListRequestDto,
    publishedBefore: Date,
  ): Promise<PageResponse<ArticleDto>> {
    let opts: ArticleFindOptions = {
      page: request.page,
      limit: DEFAULT_PAGE_SIZE,
      category: request.category,
      language: request.language,
      sourceId: request.sourceId,
      publishedBefore: publishedBefore,
    };

    if (request.excludeHomeArticles) {
      const homeFeeds = await this.cacheService.getByPrefix<HomeFeedDto>('pf:article:home:request');
      const articleIds = homeFeeds
        .flatMap((feed) => feed.section.articles)
        .map((article) => article.id);

      opts = { ...opts, excludeIds: articleIds };
    }

    return this.getArticlesByOpts(opts);
  }

  private async getArticlesByOpts(opts: ArticleFindOptions): Promise<PageResponse<ArticleDto>> {
    if (opts.category && !this.categoryService.isSupportedCategory(opts.category)) {
      this.logger.warn(ArticleService.name, `category: ${opts.category} is not found`);
      throw new NotFoundException();
    }

    if (!this.languageService.isSupportedLanguage(opts.language)) {
      this.logger.warn(ArticleService.name, `language: ${opts.language} is not found`);
      throw new NotFoundException();
    }

    const [data, total] = await this.getFilteredArticlesFromDb(opts);
    this.logger.log(ArticleService.name, 'Load articles from db.');

    return new PageResponse<ArticleDto>(data, total, opts.page, opts.limit);
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

  static getArticleRequestPublishedTime(): Date {
    return roundDownToNearestHalfHour(new Date());
  }
}
