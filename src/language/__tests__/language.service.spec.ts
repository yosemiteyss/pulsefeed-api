import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { LanguageRepository } from '../repository/language.repository';
import { EnableLanguageDto } from '../dto/enable-language.dto';
import { LanguageService } from '../language.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LoggerService } from '@common/logger';
import { Language } from '@common/model';

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
      const mockLanguages = [
        { key: 'en', enabled: true },
        { key: 'fr', enabled: true },
      ];

      languageRepository.getEnabledLanguages.mockResolvedValue(mockLanguages);

      const result = await languageService.getSupportedLanguages();

      expect(result).toEqual([{ key: 'en' }, { key: 'fr' }]);
      expect(languageRepository.getEnabledLanguages).toHaveBeenCalledTimes(1);
    });
  });

  describe('setLanguageEnabled', () => {
    it('should enable a language', async () => {
      const request: EnableLanguageDto = { key: 'en', enabled: true };
      const mockLanguage: Language = { key: 'en' };

      languageRepository.getLanguageByKey.mockResolvedValue(mockLanguage);
      languageRepository.setLanguageEnabled.mockResolvedValue();

      await languageService.setLanguageEnabled(request);

      expect(languageRepository.getLanguageByKey).toHaveBeenCalledWith('en');
      expect(languageRepository.setLanguageEnabled).toHaveBeenCalledWith('en', true);
    });

    it('should throw NotFoundException if language is not found', async () => {
      const request: EnableLanguageDto = { key: 'nonexistent', enabled: true };

      languageRepository.getLanguageByKey.mockResolvedValue(undefined);

      await expect(languageService.setLanguageEnabled(request)).rejects.toThrow(NotFoundException);
    });
  });
});
