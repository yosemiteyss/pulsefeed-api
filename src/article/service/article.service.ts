import {
  ArticleCategoryRepository,
  CacheKeyBuilder,
  CacheService,
  LanguageRepository,
  ONE_DAY_IN_MS,
  PageResponse,
  roundDownToNearestHalfHour,
} from '@pulsefeed/common';
import {
  ApiResponseCacheKey,
  DEFAULT_PAGE_SIZE,
  getLastYearDate,
  ShuffleService,
  toCacheKeyPart,
} from '../../shared';
import {
  CategoryFeedRequest,
  LatestFeedRequest,
  SearchArticleRequest,
  LatestFeedResponse,
} from '../dto';
import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { ArticleFeedBuilder } from './article-feed-builder.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ArticleData, ArticleFilter } from '../model';
import { ArticleRepository } from '../repository';
import { NewsBlock } from '../../news-block';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryRepository: ArticleCategoryRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly cacheService: CacheService,
    private readonly shuffleService: ShuffleService,
    private readonly feedBuilder: ArticleFeedBuilder,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async getLatestFeedPageResponse({
    languageKey,
    feedSection,
  }: LatestFeedRequest): Promise<LatestFeedResponse<NewsBlock>> {
    const action: () => Promise<PageResponse<NewsBlock>> = async () => {
      const categories = await this.categoryRepository.getEnabledCategories();
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(languageKey);
      const topCategories = categories.sort((a, b) => b.priority! - a.priority!).slice(0, 5);

      // Resolve category index.
      let categoryIndex = 0;
      if (feedSection) {
        const index = topCategories.findIndex((category) => category.key === feedSection);
        if (index != -1) {
          categoryIndex = index;
        }
      }

      // Get first 10 articles from the selected category.
      const publishedBefore = roundDownToNearestHalfHour(new Date());
      let [articles] = await this.getArticlesByFilter({
        page: 1,
        limit: 20,
        categoryKey: topCategories[categoryIndex].key,
        languageKey: languageKey,
        publishedBefore: publishedBefore,
      });
      articles = articles.slice(0, 10);

      const blockList = this.feedBuilder.buildLatestFeedPage(
        articles,
        topCategories[categoryIndex],
        categoryTitles[topCategories[categoryIndex].key],
        categoryIndex === 0,
      );

      const isLastPage = categoryIndex + 1 >= topCategories.length;
      const nextCategory = isLastPage ? undefined : topCategories[categoryIndex + 1];

      return {
        data: blockList,
        isLastPage: isLastPage,
        feedSection: nextCategory?.key,
      };
    };

    return this.cacheService.wrap(
      CacheKeyBuilder.buildKeyWithParams(ApiResponseCacheKey.ARTICLE_LATEST_FEED.prefix, {
        languageKey: languageKey,
        feedSection: feedSection,
      }),
      action,
      ApiResponseCacheKey.ARTICLE_LATEST_FEED.ttl,
    );
  }

  async getCategoryFeedPageResponse({
    page,
    languageKey,
    categoryKey,
  }: CategoryFeedRequest): Promise<PageResponse<NewsBlock>> {
    const publishedBefore = roundDownToNearestHalfHour(new Date());
    const filter: ArticleFilter = {
      page: page,
      limit: DEFAULT_PAGE_SIZE,
      categoryKey: categoryKey,
      languageKey: languageKey,
      publishedBefore: publishedBefore,
    };

    const action: () => Promise<PageResponse<NewsBlock>> = async () => {
      const [articles, total] = await this.getArticlesByFilter(filter);
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(languageKey);

      // Add top spacing for first page.
      const topSpacing = filter.page === 0;
      const blockList = this.feedBuilder.buildCategoryFeedPage(
        articles,
        categoryTitles[categoryKey],
        topSpacing,
      );
      return new PageResponse(blockList, total, filter.page, filter.limit);
    };

    return this.cacheService.wrap(
      CacheKeyBuilder.buildKeyWithParams(ApiResponseCacheKey.ARTICLE_CATEGORY_FEED.prefix, {
        filter: filter,
      }),
      action,
      ApiResponseCacheKey.ARTICLE_CATEGORY_FEED.ttl,
    );
  }

  async searchArticles(request: SearchArticleRequest): Promise<PageResponse<NewsBlock>> {
    const filter: ArticleFilter = {
      page: request.page,
      limit: DEFAULT_PAGE_SIZE,
      languageKey: request.languageKey,
      publishedBefore: getLastYearDate(),
      searchTerm: request.term,
    };
    const cacheKey = ApiResponseCacheKey.ARTICLE_SEARCH + toCacheKeyPart(filter);

    const action: () => Promise<PageResponse<NewsBlock>> = async () => {
      const [articles, total] = await this.getArticlesByFilter(filter);
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(
        request.languageKey,
      );

      // Add top spacing for first page.
      const topSpacing = filter.page === 0;
      const blockList = this.feedBuilder.buildArticleListPage(articles, categoryTitles, topSpacing);

      return new PageResponse(blockList, total, filter.page, filter.limit);
    };

    return this.cacheService.wrap(cacheKey, action, ONE_DAY_IN_MS);
  }

  private async getArticlesByFilter(filter: ArticleFilter): Promise<[ArticleData[], number]> {
    const categories = await this.categoryRepository.getEnabledCategories();
    if (filter.categoryKey && !categories.find((category) => category.key === filter.categoryKey)) {
      throw new NotFoundException('Invalid category');
    }

    const languages = await this.languageRepository.getEnabledLanguages();
    if (!languages.find((language) => language.key === filter.languageKey)) {
      throw new NotFoundException('Invalid language');
    }

    const [articles, total] = await this.articleRepository.getArticles(filter);
    this.logger.log(
      `Get articles from db, size: ${articles.length}, total: ${total}`,
      ArticleService.name,
    );

    const shuffled = this.shuffleService.shuffleByKey(articles, (article) => article.source.id);
    return [shuffled, total];
  }
}
