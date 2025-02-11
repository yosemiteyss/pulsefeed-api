import {
  CacheKeyBuilder,
  CacheService,
  TrendingKeyword,
  TrendingKeywordsRepository,
} from '@pulsefeed/common';
import { TrendingKeywordsRequest, TrendingKeywordsResponse } from '../dto';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiResponseCacheKey } from '../../shared';

@Injectable()
export class TrendingService {
  constructor(
    private readonly trendingKeywordsRepository: TrendingKeywordsRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Minimum score for a keyword to be identified as trending.
   */
  static readonly KEYWORD_TRENDING_MIN_SCORE = 5;

  /**
   * Get trending keywords list.
   * @param request trending keywords request.
   */
  async getTrendingKeywords(request: TrendingKeywordsRequest): Promise<TrendingKeywordsResponse> {
    const action: () => Promise<TrendingKeywordsResponse> = async () => {
      const keywords = await this.getTrendingKeywordsOrdered(
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
   * Returns filtered and ordered trending keywords.
   * If category key is not provided, return keywords from all categories for
   * the given language.
   * @param languageKey the language key.
   * @param categoryKey the category key.
   */
  async getTrendingKeywordsOrdered(
    languageKey: string,
    categoryKey?: string,
  ): Promise<TrendingKeyword[]> {
    const keywordsCount = 10;

    const keywordItems = await this.trendingKeywordsRepository.getKeywords(
      languageKey,
      categoryKey,
    );

    let keywords = keywordItems.map((item) => item.value);

    // Filter out keywords below min scores.
    keywords = keywords.filter(
      (keyword) => keyword.score >= TrendingService.KEYWORD_TRENDING_MIN_SCORE,
    );

    // Sort keywords by score descending.
    keywords = keywords.sort((a, b) => b.score - a.score);

    // Remove duplicated keywords.
    keywords = this.filterDuplicateKeywords(keywords);

    // Return leading keywords with the given size.
    keywords = keywords.slice(0, keywordsCount);

    return keywords;
  }

  private filterDuplicateKeywords(keywords: TrendingKeyword[]): TrendingKeyword[] {
    const keywordMap = new Map<string, TrendingKeyword>();

    for (const item of keywords) {
      const existing = keywordMap.get(item.keyword);
      if (!existing || item.lastUpdated > existing.lastUpdated) {
        keywordMap.set(item.keyword, item);
      }
    }

    return Array.from(keywordMap.values());
  }
}
