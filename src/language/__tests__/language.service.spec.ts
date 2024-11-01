import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { LanguageRepository } from '../repository/language.repository';
import { LanguageService } from '../language.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LoggerService } from '@pulsefeed/common';
import { Language } from '@pulsefeed/common';

describe('LanguageService', () => {
  let languageService: LanguageService;
  let languageRepository: jest.Mocked<LanguageRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: LanguageRepository,
          useValue: {
            getLanguageByKey: jest.fn(),
            getEnabledLanguages: jest.fn(),
            setLanguageEnabled: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    languageService = module.get<LanguageService>(LanguageService);
    languageRepository = module.get(LanguageRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSupportedLanguages', () => {
    it('should return a list of supported languages', async () => {
      const mockLanguages: Language[] = [{ key: 'en' }, { key: 'fr' }];

      languageRepository.getEnabledLanguages.mockResolvedValue(mockLanguages);

      const result = await languageService.getSupportedLanguages();

      expect(result).toEqual(mockLanguages);
      expect(languageRepository.getEnabledLanguages).toHaveBeenCalledTimes(1);
    });
  });

  describe('setLanguageEnabled', () => {
    it('should enable a language', async () => {
      const mockLanguage: Language = { key: 'en' };

      languageRepository.getLanguageByKey.mockResolvedValue(mockLanguage);
      languageRepository.setLanguageEnabled.mockResolvedValue();

      await languageService.setLanguageEnabled('en', true);

      expect(languageRepository.getLanguageByKey).toHaveBeenCalledWith('en');
      expect(languageRepository.setLanguageEnabled).toHaveBeenCalledWith('en', true);
    });

    it('should throw NotFoundException if language is not found', async () => {
      languageRepository.getLanguageByKey.mockResolvedValue(undefined);

      await expect(languageService.setLanguageEnabled('invalid', true)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
