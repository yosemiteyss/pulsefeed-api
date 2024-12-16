import {
  ArticleCategoryRepository,
  CacheService,
  LanguageRepository,
  ONE_HOUR_IN_MS,
  PageResponse,
  roundDownToNearestHalfHour,
} from '@pulsefeed/common';
import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { DEFAULT_PAGE_SIZE, ResponseCacheKeys, ShuffleService } from '../../shared';
import { ArticleFeedBuilder } from './article-feed-builder.service';
import { CategoryFeedRequest, LatestFeedRequest } from '../dto';
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

  async getLatestFeedPageResponse(request: LatestFeedRequest): Promise<PageResponse<NewsBlock>> {
    const cacheKey = ResponseCacheKeys.ARTICLE_FEED_LATEST.replace(
      '{request}',
      JSON.stringify(request),
    );

    const action: () => Promise<PageResponse<NewsBlock>> = async () => {
      const categories = await this.categoryRepository.getEnabledCategories();
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(
        request.languageKey,
      );
      const topCategories = categories.sort((a, b) => b.priority! - a.priority!).slice(0, 5);

      // Resolve category index.
      let categoryIndex = 0;
      if (request.feedSection) {
        const index = topCategories.findIndex((category) => category.key === request.feedSection);
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
        languageKey: request.languageKey,
        publishedBefore: publishedBefore,
      });
      articles = articles.slice(0, 10);

      const blockList = this.feedBuilder.buildLatestFeedPage(
        articles,
        topCategories[categoryIndex],
        categoryTitles[topCategories[categoryIndex].key],
        categoryIndex === 0,
      );
      return {
        data: blockList,
        isLastPage: categoryIndex + 1 >= topCategories.length,
      };
    };

    return this.cacheService.wrap(cacheKey, action, ONE_HOUR_IN_MS / 2);
  }

  async getCategoryFeedPageResponse(
    request: CategoryFeedRequest,
  ): Promise<PageResponse<NewsBlock>> {
    const publishedBefore = roundDownToNearestHalfHour(new Date());
    const filter: ArticleFilter = {
      page: request.page,
      limit: DEFAULT_PAGE_SIZE,
      categoryKey: request.categoryKey,
      languageKey: request.languageKey,
      publishedBefore: publishedBefore,
    };
    const cacheKey = ResponseCacheKeys.ARTICLE_FEED_CATEGORY.replace(
      '{filter}',
      JSON.stringify(filter),
    );

    const action: () => Promise<PageResponse<NewsBlock>> = async () => {
      const [articles, total] = await this.getArticlesByFilter(filter);
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(
        request.categoryKey,
      );

      // Add top spacing for first page.
      const topSpacing = filter.page === 0;
      const blockList = this.feedBuilder.buildCategoryFeedPage(
        articles,
        categoryTitles[request.categoryKey],
        topSpacing,
      );
      return new PageResponse(blockList, total, filter.page, filter.limit);
    };

    return this.cacheService.wrap(cacheKey, action, ONE_HOUR_IN_MS);
  }

  private async getArticlesByFilter(filter: ArticleFilter): Promise<[ArticleData[], number]> {
    const categories = await this.categoryRepository.getEnabledCategories();
    if (filter.categoryKey && !categories.find((category) => category.key === filter.categoryKey)) {
      throw new NotFoundException('Invalid category');
    }

    const languages = await this.languageRepository.getEnabledLanguages();
    if (!languages.find((language) => language.key === filter.categoryKey)) {
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
