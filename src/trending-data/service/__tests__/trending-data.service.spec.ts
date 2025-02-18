import {
  ArticleCategoryEnum,
  CacheItem,
  LanguageEnum,
  TrendingKeyword,
  TrendingKeywordsRepository,
} from '@pulsefeed/common';
import { TrendingDataService } from '../trending-data.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ArticleRepository } from '../../../article-data';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@nestjs/common';

describe('TrendingService', () => {
  let trendingDataService: TrendingDataService;
  let trendingKeywordsRepository: DeepMockProxy<TrendingKeywordsRepository>;
  let articleRepository: DeepMockProxy<ArticleRepository>;
  let loggerService: DeepMockProxy<LoggerService>;

  beforeEach(async () => {
    trendingKeywordsRepository = mockDeep<TrendingKeywordsRepository>();
    articleRepository = mockDeep<ArticleRepository>();
    loggerService = mockDeep<LoggerService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrendingDataService,
        {
          provide: TrendingKeywordsRepository,
          useValue: trendingKeywordsRepository,
        },
        {
          provide: ArticleRepository,
          useValue: articleRepository,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: loggerService,
        },
      ],
    }).compile();

    trendingDataService = module.get(TrendingDataService);
  });

  describe('getTrendingKeywordsOrdered', () => {
    it('should return keywords sorted', async () => {
      const keywordItems: CacheItem<TrendingKeyword>[] = [
        {
          key: 'key-1',
          value: {
            keyword: 'keyword-1',
            score: TrendingDataService.KEYWORD_TRENDING_MIN_SCORE,
            lastUpdated: new Date(),
          },
        },
        {
          key: 'key-2',
          value: {
            keyword: 'keyword-2',
            score: TrendingDataService.KEYWORD_TRENDING_MIN_SCORE + 1,
            lastUpdated: new Date(),
          },
        },
      ];

      trendingKeywordsRepository.getKeywords.mockResolvedValue(keywordItems);

      const result = await trendingDataService.getTrendingKeywordsOrdered(
        LanguageEnum.en_us,
        ArticleCategoryEnum.LOCAL,
      );

      expect(result[0]).toEqual(keywordItems[1].value);
    });

    it('should return keywords with score >= min score', async () => {
      const keywordItems: CacheItem<TrendingKeyword>[] = [
        {
          key: 'key-1',
          value: {
            keyword: 'keyword-1',
            score: TrendingDataService.KEYWORD_TRENDING_MIN_SCORE - 1,
            lastUpdated: new Date(),
          },
        },
        {
          key: 'key-2',
          value: {
            keyword: 'keyword-2',
            score: TrendingDataService.KEYWORD_TRENDING_MIN_SCORE,
            lastUpdated: new Date(),
          },
        },
      ];

      trendingKeywordsRepository.getKeywords.mockResolvedValue(keywordItems);

      const result = await trendingDataService.getTrendingKeywordsOrdered(
        LanguageEnum.en_us,
        ArticleCategoryEnum.LOCAL,
      );

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(keywordItems[1].value);
    });

    it('should return keywords with the given size', async () => {
      const keywordItems: CacheItem<TrendingKeyword>[] = Array.from({ length: 20 }, (_, index) => ({
        key: `key-${index}`,
        value: {
          keyword: `keyword-${index}`,
          score: TrendingDataService.KEYWORD_TRENDING_MIN_SCORE,
          lastUpdated: new Date(),
        },
      }));

      trendingKeywordsRepository.getKeywords.mockResolvedValue(keywordItems);

      const result = await trendingDataService.getTrendingKeywordsOrdered(
        LanguageEnum.en_us,
        ArticleCategoryEnum.LOCAL,
      );

      expect(result.length).toBe(10);
    });
  });
});
