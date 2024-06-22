import { LanguageService } from '../language.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerService } from '@common/logger';
import { LanguageEntity } from '@common/db';
import { Repository } from 'typeorm';

const mockLanguageRepository = {
  find: jest.fn(),
};

const mockLoggerService = {};

describe('LanguageService', () => {
  let languageService: LanguageService;
  let languageRepository: Repository<LanguageEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: getRepositoryToken(LanguageEntity), useValue: mockLanguageRepository },
      ],
    }).compile();

    languageService = module.get<LanguageService>(LanguageService);
    languageRepository = module.get<Repository<LanguageEntity>>(getRepositoryToken(LanguageEntity));
  });

  it('should be defined', () => {
    expect(languageService).toBeDefined();
  });

  describe('getSupportedLanguages', () => {
    it('should return an array of enabled languages', async () => {
      const entities: LanguageEntity[] = [{ key: 'en' }, { key: 'fr' }];
      jest.spyOn(languageRepository, 'find').mockResolvedValue(entities as any);

      const result = await languageService.getSupportedLanguages();
      expect(result).toHaveLength(2);
      expect(result.map((lang) => lang.key)).toEqual(['en', 'fr']);
    });
  });

  // TODO: setLanguageEnabled
});
