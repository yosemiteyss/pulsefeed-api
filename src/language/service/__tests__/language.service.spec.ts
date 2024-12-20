import { CacheService, Language, LanguageRepository } from '@pulsefeed/common';
import { LanguageListResponse, LanguageResponse } from '../../dto';
import { LoggerService, NotFoundException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiResponseCacheKey } from '../../../shared';
import { LanguageService } from '../index';
import { Test } from '@nestjs/testing';

describe('LanguageService', () => {
  let languageService: LanguageService;
  let languageRepository: DeepMockProxy<LanguageRepository>;
  let cacheService: DeepMockProxy<CacheService>;
  let loggerService: DeepMockProxy<LoggerService>;

  beforeEach(async () => {
    languageRepository = mockDeep<LanguageRepository>();
    cacheService = mockDeep<CacheService>();
    loggerService = mockDeep<LoggerService>();

    const module = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: LanguageRepository,
          useValue: languageRepository,
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

    languageService = module.get<LanguageService>(LanguageService);
  });

  describe('getLanguageListResponse', () => {
    it('should get cached languages', async () => {
      const mockedLangDtos: LanguageResponse[] = [{ key: 'en' }];
      cacheService.wrap.mockResolvedValue(mockedLangDtos);

      const { generate, ttl } = ApiResponseCacheKey.LANGUAGE_LIST;
      const result = await languageService.getLanguageListResponse();
      expect(cacheService.wrap).toHaveBeenCalledWith(generate(), expect.any(Function), ttl);

      const response = new LanguageListResponse(mockedLangDtos);
      expect(result).toEqual(response);
    });
  });

  describe('setLanguageEnabled', () => {
    it('should set language enabled, and clear cache', async () => {
      const language: Language = { key: 'en' };
      languageRepository.getLanguage.mockResolvedValue(language);
      await languageService.setLanguageEnabled({ key: language.key, enabled: false });
      expect(languageRepository.setLanguageEnabled).toHaveBeenCalledWith(language.key, false);
      expect(cacheService.deleteByPrefix).toHaveBeenCalledWith(
        ApiResponseCacheKey.LANGUAGE_LIST.prefix,
        true,
      );
    });

    it('should throw NotFoundException if language is not found', async () => {
      const language: Language = { key: 'en' };
      languageRepository.getLanguage.mockResolvedValue(undefined);
      await expect(
        languageService.setLanguageEnabled({ key: language.key, enabled: false }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
