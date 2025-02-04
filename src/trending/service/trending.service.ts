import { TrendingKeyword, TrendingKeywordsRepository } from '@pulsefeed/common';
import { TrendingKeywordsRequest, TrendingKeywordsResponse } from '../dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrendingService {
  constructor(private readonly trendingKeywordsRepository: TrendingKeywordsRepository) {}

  /**
   * Minimum score for a keyword to be identified as trending.
   */
  private readonly KEYWORD_TRENDING_MIN_SCORE = 5;

  /**
   * Returns filtered and ordered trending keywords.
   * If category key is not provided, return keywords from all categories for
   * the given language.
   *
   * @param languageKey the language key.
   * @param categoryKey the category key.
   */
  async getTrendingKeywords({
    languageKey,
    categoryKey,
  }: TrendingKeywordsRequest): Promise<TrendingKeywordsResponse> {
    // TODO: cache result
    const keywordsCount = 10;

    const keywordItems = await this.trendingKeywordsRepository.getKeywords(
      languageKey,
      categoryKey,
    );

    let keywords = keywordItems.map((item) => item.value);

    // Filter out keywords below min scores.
    keywords = keywords.filter((keyword) => keyword.score >= this.KEYWORD_TRENDING_MIN_SCORE);

    // Sort keywords by score descending.
    keywords = keywords.sort((a, b) => b.score - a.score);

    // Remove duplicated keywords.
    keywords = this.removeDuplicateKeywords(keywords);

    // Return leading keywords with the given size.
    keywords = keywords.slice(0, keywordsCount);

    console.log(keywords);

    return new TrendingKeywordsResponse(keywords.map((keyword) => keyword.keyword));
  }

  private removeDuplicateKeywords(keywords: TrendingKeyword[]): TrendingKeyword[] {
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
