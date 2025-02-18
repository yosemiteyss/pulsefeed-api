import { TrendingArticlesResponse } from '../dto/trending-articles.response';
import { TrendingArticlesRequest } from '../dto/trending-articles.request';
import { TrendingKeywordsRequest, TrendingKeywordsResponse } from '../dto';
import { CacheKeyBuilder, CacheService } from '@pulsefeed/common';
import { TrendingDataService } from '../../trending-data';
import { ApiResponseCacheKey } from '../../shared';
import { ArticleResponse } from '../../article';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrendingService {
  constructor(
    private readonly trendingDataService: TrendingDataService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Get trending keywords list.
   * @param request trending keywords request.
   */
  async getTrendingKeywordsResponse(
    request: TrendingKeywordsRequest,
  ): Promise<TrendingKeywordsResponse> {
    const action: () => Promise<TrendingKeywordsResponse> = async () => {
      const keywords = await this.trendingDataService.getTrendingKeywordsOrdered(
        request.languageKey,
        request.categoryKey,
      );
      return new TrendingKeywordsResponse(keywords.map((keyword) => keyword.keyword));
    };

    return this.cacheService.wrap(
      CacheKeyBuilder.buildKeyWithParams(ApiResponseCacheKey.TRENDING_KEYWORDS_LIST.prefix, {
        languageKey: request.languageKey,
        categoryKey: request.categoryKey,
      }),
      action,
      ApiResponseCacheKey.TRENDING_KEYWORDS_LIST.ttl,
    );
  }

  /**
   * Get trending articles.
   * @param languageKey the language key.
   * @param categoryKey the category key.
   */
  async getTrendingArticlesResponse({
    languageKey,
    categoryKey,
  }: TrendingArticlesRequest): Promise<TrendingArticlesResponse> {
    const action: () => Promise<TrendingArticlesResponse> = async () => {
      const trendingArticles = await this.trendingDataService.getTrendingArticles(
        languageKey,
        categoryKey,
      );
      const result = trendingArticles.map((item) => ArticleResponse.fromModel(item.article));

      return {
        articles: result,
      };
    };

    return this.cacheService.wrap(
      CacheKeyBuilder.buildKeyWithParams(ApiResponseCacheKey.TRENDING_ARTICLES_LIST.prefix, {
        languageKey: languageKey,
        categoryKey: categoryKey,
      }),
      action,
      ApiResponseCacheKey.TRENDING_ARTICLES_LIST.ttl,
    );
  }
}
