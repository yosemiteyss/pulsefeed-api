import {
  ArticleCategoryEnum,
  CacheItem,
  CacheService,
  LanguageEnum,
  RemoteConfigService,
  TrendingKeyword,
  TrendingKeywordsRepository,
} from '@pulsefeed/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TrendingService } from '../trending.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleRepository } from '../../../article';
import { LoggerService } from '@nestjs/common';

describe('TrendingService', () => {
  let trendingService: TrendingService;
  let trendingKeywordsRepository: DeepMockProxy<TrendingKeywordsRepository>;
  let articleRepository: DeepMockProxy<ArticleRepository>;
  let cacheService: DeepMockProxy<CacheService>;
  let loggerService: DeepMockProxy<LoggerService>;
  let remoteConfigService: DeepMockProxy<RemoteConfigService>;

  beforeEach(async () => {
    trendingKeywordsRepository = mockDeep<TrendingKeywordsRepository>();
    articleRepository = mockDeep<ArticleRepository>();
    cacheService = mockDeep<CacheService>();
    loggerService = mockDeep<LoggerService>();
    remoteConfigService = mockDeep<RemoteConfigService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrendingService,
        {
          provide: TrendingKeywordsRepository,
          useValue: trendingKeywordsRepository,
        },
        {
          provide: ArticleRepository,
          useValue: articleRepository,
        },
        {
          provide: CacheService,
          useValue: cacheService,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: loggerService,
        },
        {
          provide: RemoteConfigService,
          useValue: remoteConfigService,
        },
      ],
    }).compile();

    trendingService = module.get(TrendingService);
  });

  describe('getTrendingKeywordsOrdered', () => {
    it('should return keywords sorted', async () => {
      const keywordItems: CacheItem<TrendingKeyword>[] = [
        {
          key: 'key-1',
          value: {
            keyword: 'keyword-1',
            score: TrendingService.KEYWORD_TRENDING_MIN_SCORE,
            lastUpdated: new Date(),
          },
        },
        {
          key: 'key-2',
          value: {
            keyword: 'keyword-2',
            score: TrendingService.KEYWORD_TRENDING_MIN_SCORE + 1,
            lastUpdated: new Date(),
          },
        },
      ];

      trendingKeywordsRepository.getKeywords.mockResolvedValue(keywordItems);

      const result = await trendingService.getTrendingKeywordsOrdered(
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
            score: TrendingService.KEYWORD_TRENDING_MIN_SCORE - 1,
            lastUpdated: new Date(),
          },
        },
        {
          key: 'key-2',
          value: {
            keyword: 'keyword-2',
            score: TrendingService.KEYWORD_TRENDING_MIN_SCORE,
            lastUpdated: new Date(),
          },
        },
      ];

      trendingKeywordsRepository.getKeywords.mockResolvedValue(keywordItems);

      const result = await trendingService.getTrendingKeywordsOrdered(
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
          score: TrendingService.KEYWORD_TRENDING_MIN_SCORE,
          lastUpdated: new Date(),
        },
      }));

      trendingKeywordsRepository.getKeywords.mockResolvedValue(keywordItems);

      const result = await trendingService.getTrendingKeywordsOrdered(
        LanguageEnum.en_us,
        ArticleCategoryEnum.LOCAL,
      );

      expect(result.length).toBe(10);
    });
  });
});
