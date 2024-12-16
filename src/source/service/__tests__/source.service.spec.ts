import {
  CacheService,
  LanguageEnum,
  ONE_DAY_IN_MS,
  PageResponse,
  Source,
  SourceRepository,
} from '@pulsefeed/common';
import { DEFAULT_PAGE_SIZE, ResponseCacheKeys } from '../../../shared';
import { LoggerService, NotFoundException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SourceService } from '../source.service';
import { SourceResponse } from '../../dto';
import { Test } from '@nestjs/testing';

describe('SourceService', () => {
  let sourceService: SourceService;
  let sourceRepository: DeepMockProxy<SourceRepository>;
  let cacheService: DeepMockProxy<CacheService>;
  let loggerService: DeepMockProxy<LoggerService>;

  beforeEach(async () => {
    sourceRepository = mockDeep<SourceRepository>();
    cacheService = mockDeep<CacheService>();
    loggerService = mockDeep<LoggerService>();

    const module = await Test.createTestingModule({
      providers: [
        SourceService,
        {
          provide: SourceRepository,
          useValue: sourceRepository,
        },
        {
          provide: CacheService,
          useValue: cacheService,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: loggerService,
        },
      ],
    }).compile();

    sourceService = module.get<SourceService>(SourceService);
  });

  describe('getEnabledSourcesPageResponse', () => {
    it('should get cached sources page', async () => {
      const page = 1;
      const responses = [new SourceResponse('id', 'title', 'link', 'imageUrl', 'description')];
      const mockedPage: PageResponse<SourceResponse> = new PageResponse(
        responses,
        responses.length,
        page,
        DEFAULT_PAGE_SIZE,
      );
      cacheService.wrap.mockResolvedValue(mockedPage);

      const cacheKey = ResponseCacheKeys.SOURCE_PAGE.replace('{page}', `${page}`).replace(
        '{limit}',
        `${DEFAULT_PAGE_SIZE}`,
      );
      const result = await sourceService.getSourcePageResponse({ page });
      expect(cacheService.wrap).toHaveBeenCalledWith(cacheKey, expect.any(Function), ONE_DAY_IN_MS);

      const expected = new PageResponse<SourceResponse>(
        responses,
        responses.length,
        page,
        DEFAULT_PAGE_SIZE,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('setSourceEnabled', () => {
    it('should set source enabled, and clear cache', async () => {
      const source: Source = {
        id: 'id',
        title: 'title',
        link: 'link',
        languages: [LanguageEnum.en_us],
      };
      sourceRepository.getSource.mockResolvedValue(source);
      await sourceService.setSourceEnabled({ id: 'id', enabled: false });
      expect(sourceRepository.setSourceEnabled).toHaveBeenCalledWith(source.id, false);
      expect(cacheService.deleteByPrefix).toHaveBeenCalledWith(ResponseCacheKeys.SOURCE_LIST, true);
    });

    it('should throw NotFoundException if source is not found', async () => {
      sourceRepository.getSource.mockResolvedValue(undefined);
      await expect(sourceService.setSourceEnabled({ id: 'id', enabled: false })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
