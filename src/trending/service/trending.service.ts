import { Article, TrendingKeyword, TrendingKeywordsRepository } from '@pulsefeed/common';
import { ArticleFilter, ArticleRepository, ArticleResponse } from '../../article';
import { TrendingArticlesResponse } from '../dto/trending-articles.response';
import { TrendingArticlesRequest } from '../dto/trending-articles.request';
import { TrendingKeywordsRequest, TrendingKeywordsResponse } from '../dto';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getLastQuarterHour } from '../../shared';

@Injectable()
export class TrendingService {
  constructor(
    private readonly trendingKeywordsRepository: TrendingKeywordsRepository,
    private readonly articleRepository: ArticleRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Minimum score for a keyword to be identified as trending.
   */
  private readonly KEYWORD_TRENDING_MIN_SCORE = 5;

  async getTrendingKeywords(request: TrendingKeywordsRequest): Promise<TrendingKeywordsResponse> {
    const keywords = await this.getTrendingKeywordsOrdered(request);
    return new TrendingKeywordsResponse(keywords.map((keyword) => keyword.keyword));
  }

  /**
   * Returns filtered and ordered trending keywords.
   * If category key is not provided, return keywords from all categories for
   * the given language.
   * @param languageKey the language key.
   * @param categoryKey the category key.
   */
  private async getTrendingKeywordsOrdered({
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
    const keywords: TrendingKeyword[] = await this.getTrendingKeywordsOrdered({
      languageKey,
      categoryKey,
    });

    if (keywords.length === 0) {
      return new TrendingArticlesResponse([]);
    }

    const keywordValues = keywords.map((keyword) => keyword.keyword);

    // Get articles with matched trending keywords.
    const quarterHourAgo = getLastQuarterHour();
    const filter: ArticleFilter = {
      page: 1,
      limit: 50,
      categoryKey: categoryKey,
      languageKey: languageKey,
      publishedBefore: quarterHourAgo,
      keywords: keywordValues,
    };
    const [articleDataList] = await this.articleRepository.getArticles(filter);

    // Get one article for every keyword.
    const articleList: { article: Article; totalScore: number }[] = [];

    // For each keyword, add matched article to list.
    for (const articleData of articleDataList) {
      // 1. Calculate total keywords scores.
      let baseScore = 0;
      for (const keyword of keywords) {
        const articleKeywords = articleData.article.keywords ?? [];
        if (articleKeywords.includes(keyword.keyword)) {
          baseScore += keyword.score;
        }
      }

      // 2. Calculate freshness.
      const now = Date.now();
      const publishedAt = articleData.article.publishedAt ?? new Date();
      const timeDiff = now - publishedAt.getTime();
      const decayFactor = 0.000001; // Adjust decay sensitivity
      const freshness = Math.exp(-decayFactor * timeDiff) + 0.01;

      this.logger.log(`baseScore: ${baseScore}, freshness: ${freshness}`, TrendingService.name);

      // 3. Calculate total score.
      const totalScore = baseScore * freshness;
      articleList.push({
        article: articleData.article,
        totalScore: totalScore,
      });
    }

    const sortedArticles = articleList.sort((a, b) => b.totalScore - a.totalScore);
    const slicedArticles = sortedArticles.slice(0, 10);

    return new TrendingArticlesResponse(
      slicedArticles.map((item) => ArticleResponse.fromModel(item.article)),
    );
  }
}
