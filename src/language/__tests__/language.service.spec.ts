import { mockLoggerService } from '../../common/mock/logger.service.mock';
import { EnableLanguageDto } from '../dto/enable-language.dto';
import { LanguageRepository } from '../language.repository';
import { LanguageService } from '../language.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LoggerService } from '@common/logger';

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
            find: jest.fn(),
            findEnabled: jest.fn(),
            save: jest.fn(),
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

  describe('getSupportedLanguages', () => {
    it('should return a list of supported languages', async () => {
      const mockLanguages = [
        { key: 'en', enabled: true },
        { key: 'fr', enabled: true },
      ];

      languageRepository.findEnabled.mockResolvedValue(mockLanguages);

      const result = await languageService.getSupportedLanguages();

      expect(result).toEqual([{ key: 'en' }, { key: 'fr' }]);
      expect(languageRepository.findEnabled).toHaveBeenCalledTimes(1);
    });
  });

  describe('setLanguageEnabled', () => {
    it('should enable a language', async () => {
      const request: EnableLanguageDto = { key: 'en', enabled: true };
      const mockLanguage = { key: 'en', enabled: false };

      languageRepository.find.mockResolvedValue(mockLanguage);
      languageRepository.save.mockResolvedValue(undefined);

      await languageService.setLanguageEnabled(request);

      expect(languageRepository.find).toHaveBeenCalledWith('en');
      expect(languageRepository.save).toHaveBeenCalledWith({ ...mockLanguage, enabled: true });
    });

    it('should throw NotFoundException if language is not found', async () => {
      const request: EnableLanguageDto = { key: 'nonexistent', enabled: true };

      languageRepository.find.mockResolvedValue(null);

      await expect(languageService.setLanguageEnabled(request)).rejects.toThrow(NotFoundException);
    });
  });
});
