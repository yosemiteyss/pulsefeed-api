import { TrendingKeyword, TrendingKeywordsRepository } from '@pulsefeed/common';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ArticleRepository } from '../../article-data';
import { getLastQuarterHour } from '../../shared';
import { ArticleData } from '../../article';
import moment from 'moment';

@Injectable()
export class TrendingDataService {
  constructor(
    private readonly trendingKeywordsRepository: TrendingKeywordsRepository,
    private readonly articleRepository: ArticleRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Minimum score for a keyword to be identified as trending.
   */
  static readonly KEYWORD_TRENDING_MIN_SCORE = 5;

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
      (keyword) => keyword.score >= TrendingDataService.KEYWORD_TRENDING_MIN_SCORE,
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

  async getTrendingArticles(languageKey: string, categoryKey: string): Promise<ArticleData[]> {
    const trendingKeywords = await this.getTrendingKeywordsOrdered(languageKey, categoryKey);
    if (trendingKeywords.length === 0) {
      return [];
    }

    const trendingKeywordsList = trendingKeywords.map((item) => item.keyword);

    // Get articles from db up to one week.
    const oneWeekAgo = moment.utc().subtract('1', 'week').startOf('day').toDate();
    const publishedBefore = getLastQuarterHour();

    const [articleDataList] = await this.articleRepository.getArticles({
      page: 1,
      limit: 200,
      categoryKey: categoryKey,
      languageKey: languageKey,
      publishedBefore: publishedBefore,
      publishedAfter: oneWeekAgo,
    });

    // Sort articles by number of matched trending keywords.
    let sortedDataList = articleDataList.sort((a, b) => {
      const aKeywords = a.article.keywords ?? [];
      const bKeywords = b.article.keywords ?? [];

      const aMatchedKeywords = aKeywords.filter((keyword) =>
        trendingKeywordsList.includes(keyword),
      );
      const bMatchedKeywords = bKeywords.filter((keyword) =>
        trendingKeywordsList.includes(keyword),
      );

      return bMatchedKeywords.length - aMatchedKeywords.length;
    });

    const TRENDING_ARTICLES_COUNT = 10;
    const result: ArticleData[] = [];

    // For each trending keyword, add one article.
    for (const trendingKeyword of trendingKeywordsList) {
      if (result.length > TRENDING_ARTICLES_COUNT) {
        break;
      }

      let i = 0;
      while (i < sortedDataList.length) {
        const currentArticle = sortedDataList[i];

        if (currentArticle.article.keywords?.includes(trendingKeyword)) {
          // Remove added article.
          result.push(currentArticle);
          sortedDataList.splice(i, 1);

          // Remove articles containing the same trending keyword.
          sortedDataList = sortedDataList.filter((item) => {
            return !item.article.keywords?.includes(trendingKeyword);
          });

          break;
        }

        i++;
      }
    }

    return result;
  }
}
