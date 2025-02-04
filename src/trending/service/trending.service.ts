import { ArticleFilter, ArticleRepository, ArticleResponse } from '../../article';
import { TrendingKeyword, TrendingKeywordsRepository } from '@pulsefeed/common';
import { TrendingArticlesResponse } from '../dto/trending-articles.response';
import { TrendingArticlesRequest } from '../dto/trending-articles.request';
import { TrendingKeywordsRequest, TrendingKeywordsResponse } from '../dto';
import { getLastQuarterHour, getYearsAgo } from '../../shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrendingService {
  constructor(
    private readonly trendingKeywordsRepository: TrendingKeywordsRepository,
    private readonly articleRepository: ArticleRepository,
  ) {}

  /**
   * Minimum score for a keyword to be identified as trending.
   */
  private readonly KEYWORD_TRENDING_MIN_SCORE = 5;

  async getTrendingKeywords(request: TrendingKeywordsRequest): Promise<TrendingKeywordsResponse> {
    const keywords = await this.getTrendingKeywordsList(request);
    return new TrendingKeywordsResponse(keywords.map((keyword) => keyword.keyword));
  }

  /**
   * Returns filtered and ordered trending keywords.
   * If category key is not provided, return keywords from all categories for
   * the given language.
   * @param languageKey the language key.
   * @param categoryKey the category key.
   */
  private async getTrendingKeywordsList({
    languageKey,
    categoryKey,
  }: TrendingKeywordsRequest): Promise<TrendingKeyword[]> {
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

    return keywords;
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

  /**
   * Return trending articles list.
   * @param languageKey the language key.
   * @param categoryKey the category key.
   */
  async getTrendingArticles({
    languageKey,
    categoryKey,
  }: TrendingArticlesRequest): Promise<TrendingArticlesResponse> {
    const keywords: TrendingKeyword[] = await this.getTrendingKeywordsList({
      languageKey,
      categoryKey,
    });
    const keywordValues = keywords.map((keyword) => keyword.keyword);
    const keywordScores = new Map(keywords.map((keyword) => [keyword.keyword, keyword.score]));

    const quarterHourAgo = getLastQuarterHour();
    const oneYearAgo = getYearsAgo(1);

    const filter: ArticleFilter = {
      page: 1,
      limit: 20,
      categoryKey: categoryKey,
      languageKey: languageKey,
      publishedBefore: quarterHourAgo,
      publishedAfter: oneYearAgo,
      keywords: keywordValues,
    };
    const [articleData] = await this.articleRepository.getArticles(filter);

    // Sort articles by the keyword score.
    const sortedArticles = articleData.sort((a, b) => {
      const aKeywords = a.article.keywords || [];
      const bKeywords = b.article.keywords || [];

      const aMaxScore = Math.max(...aKeywords.map((keyword) => keywordScores.get(keyword) || 0));
      const bMaxScore = Math.max(...bKeywords.map((keyword) => keywordScores.get(keyword) || 0));

      return bMaxScore - aMaxScore; // Descending order
    });

    const articleResponses = sortedArticles.map((data) => ArticleResponse.fromModel(data.article));
    return {
      articles: articleResponses,
    };
  }
}
