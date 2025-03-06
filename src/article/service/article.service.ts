import {
  ArticleCategoryRepository,
  ArticleCategoryTitle,
  CacheKeyBuilder,
  CacheService,
  LanguageRepository,
  PageResponse,
  RemoteConfigService,
} from '@pulsefeed/common';
import {
  CategoryFeedRequest,
  HeadlineFeedRequest,
  SearchArticleRequest,
  HeadlineFeedResponse,
  ArticleResponse,
  RelatedArticlesRequest,
} from '../dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import {
  ApiResponseCacheKey,
  DEFAULT_PAGE_SIZE,
  getLastQuarterHour,
  ShuffleService,
} from '../../shared';
import { FeedBuilderService } from './feed-builder.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TrendingDataService } from '../../trending-data';
import { ArticleRepository } from '../../article-data';
import { ArticleData, ArticleFilter } from '../model';
import { NewsBlock } from '../../news-block';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ArticleService implements OnModuleInit {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryRepository: ArticleCategoryRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly feedBuilder: FeedBuilderService,
    private readonly cacheService: CacheService,
    private readonly shuffleService: ShuffleService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly remoteConfigService: RemoteConfigService,
    private readonly trendingDataService: TrendingDataService,
  ) {}

  /**
   * Maximum request pages for category feed.
   * @private
   */
  private readonly CATEGORY_FEED_MAX_PAGE = 50;

  onModuleInit() {
    this.scheduleRefreshFeeds().then();
  }

  /**
   * Get headline feed.
   * @param languageKey the language key.
   * @param categoryKey the category key.
   */
  async getHeadlineFeedPage({
    languageKey,
    feedSection,
  }: HeadlineFeedRequest): Promise<HeadlineFeedResponse<NewsBlock>> {
    const action: () => Promise<PageResponse<NewsBlock>> = async () => {
      const categories = await this.categoryRepository.getEnabledCategories();
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(languageKey);
      const topCategories = categories.sort((a, b) => b.priority - a.priority).slice(0, 5);

      // Resolve category index.
      let categoryIndex = 0;
      if (feedSection) {
        const index = topCategories.findIndex((category) => category.key === feedSection);
        if (index != -1) {
          categoryIndex = index;
        }
      }

      // Get latest articles of category.
      const [articles] = await this.getArticlesByFilter({
        page: 1,
        limit: 10,
        categoryKey: topCategories[categoryIndex].key,
        languageKey: languageKey,
        publishedBefore: getLastQuarterHour(),
      });

      const blockList = this.feedBuilder.buildHeadlineFeedPage(
        articles,
        topCategories[categoryIndex],
        categoryTitles[topCategories[categoryIndex].key],
        categoryIndex === 0,
      );

      // End at last category page.
      const isLastPage = categoryIndex + 1 >= topCategories.length;
      const nextCategory = isLastPage ? undefined : topCategories[categoryIndex + 1];

      return {
        data: blockList,
        isLastPage: isLastPage,
        feedSection: nextCategory?.key,
      };
    };

    return this.cacheService.wrap(
      CacheKeyBuilder.buildKeyWithParams(ApiResponseCacheKey.ARTICLE_HEADLINE_FEED.prefix, {
        languageKey: languageKey,
        feedSection: feedSection,
      }),
      action,
      ApiResponseCacheKey.ARTICLE_HEADLINE_FEED.ttl,
    );
  }

  /**
   * Get category feed.
   * @param request the category feed request.
   * @param isUpdateCache should store result to cache or not.
   */
  async getCategoryFeedPage(
    request: CategoryFeedRequest,
    isUpdateCache: boolean = false,
  ): Promise<PageResponse<NewsBlock>> {
    if (request.page > this.CATEGORY_FEED_MAX_PAGE) {
      throw new BadRequestException('Invalid page number');
    }

    const filter: ArticleFilter = {
      page: request.page,
      limit: DEFAULT_PAGE_SIZE,
      categoryKey: request.categoryKey,
      languageKey: request.languageKey,
      publishedBefore: getLastQuarterHour(),
    };

    const action: () => Promise<PageResponse<NewsBlock>> = async () => {
      const [articles, total] = await this.getArticlesByFilter(filter);
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(
        request.languageKey,
      );

      // Show trending articles on first page.
      let trendingArticles: ArticleData[] = [];
      if (request.page === 1) {
        const trendingArticlesCount = await this.remoteConfigService.get<number>(
          'TRENDING_ARTICLES_COUNT',
          5,
        );
        trendingArticles = await this.trendingDataService.getTrendingArticles(
          request.languageKey,
          request.categoryKey,
          trendingArticlesCount,
        );
      }

      const categoryTitle = categoryTitles[request.categoryKey];
      if (!categoryTitle) {
        return {
          data: [],
          isLastPage: true,
        };
      }

      // Add top spacing for first page.
      const topSpacing = filter.page === 0;
      const blockList = await this.feedBuilder.buildCategoryFeedPage(
        articles,
        categoryTitle,
        trendingArticles,
        topSpacing,
      );

      const isLastArticlePage = request.page * filter.limit >= total;
      return {
        data: blockList,
        isLastPage: request.page === this.CATEGORY_FEED_MAX_PAGE || isLastArticlePage,
      };
    };

    // Load and store result to cache.
    if (isUpdateCache) {
      return this.cacheService.wrap(
        CacheKeyBuilder.buildKeyWithParams(
          ApiResponseCacheKey.ARTICLE_CATEGORY_FEED.prefix,
          filter,
        ),
        action,
        ApiResponseCacheKey.ARTICLE_CATEGORY_FEED.ttl,
      );
    }

    // Load stored result from cache.
    const result = await this.cacheService.get<PageResponse<NewsBlock>>(
      CacheKeyBuilder.buildKeyWithParams(ApiResponseCacheKey.ARTICLE_CATEGORY_FEED.prefix, filter),
    );

    if (!result) {
      return { data: [], isLastPage: true };
    }

    return result;
  }

  /**
   * Find related articles.
   */
  async getRelatedArticles({ articleId }: RelatedArticlesRequest): Promise<ArticleResponse[]> {
    const article = await this.articleRepository.getArticle(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const relatedArticlesSimilarity = await this.remoteConfigService.get<number>(
      'RELATED_ARTICLES_SIMILARITY',
      0.7,
    );
    const relatedArticles = await this.articleRepository.getArticlesWithSimilarKeywords(
      articleId,
      10,
      getLastQuarterHour(),
      relatedArticlesSimilarity,
    );
    return relatedArticles.map((article) => ArticleResponse.fromModel(article));
  }

  /**
   * Search articles.
   * @param page the page number.
   * @param languageKey the language key.
   * @param term the search term.
   */
  async searchArticles({
    page,
    languageKey,
    term,
  }: SearchArticleRequest): Promise<PageResponse<NewsBlock>> {
    const filter: ArticleFilter = {
      page: page,
      limit: DEFAULT_PAGE_SIZE,
      languageKey: languageKey,
      publishedBefore: getLastQuarterHour(),
      searchTerm: term,
    };

    const action: () => Promise<PageResponse<NewsBlock>> = async () => {
      const [articles, total] = await this.getArticlesByFilter(filter);
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(languageKey);

      // Add top spacing for first page.
      const topSpacing = filter.page === 0;
      const blockList = this.feedBuilder.buildArticleListPage(articles, categoryTitles, topSpacing);

      return new PageResponse(blockList, total, filter.page, filter.limit);
    };

    return this.cacheService.wrap(
      CacheKeyBuilder.buildKeyWithParams(ApiResponseCacheKey.ARTICLE_SEARCH.prefix, filter),
      action,
      ApiResponseCacheKey.ARTICLE_SEARCH.ttl,
    );
  }

  @Cron('15,45 * * * *')
  async scheduleRefreshFeeds() {
    const languages = await this.languageRepository.getEnabledLanguages();
    const categories = await this.categoryRepository.getEnabledCategories();

    //const requests: CategoryFeedRequest[] = [];

    for (const language of languages) {
      for (const category of categories) {
        for (let page = 1; page <= this.CATEGORY_FEED_MAX_PAGE; page++) {
          await this.getCategoryFeedPage(
            {
              page: page,
              languageKey: language.key,
              categoryKey: category.key,
            },
            true,
          );
          this.logger.debug!(
            `Refreshed category feed page: [${language.key}, ${category.key}, ${page}]`,
            ArticleService.name,
          );
        }
      }
    }
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
