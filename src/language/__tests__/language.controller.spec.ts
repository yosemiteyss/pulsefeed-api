import { LanguageController } from '../language.controller';
import { LanguageService } from '../language.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguageDto } from '../dto/language.dto';

describe('LanguageController', () => {
  let languageController: LanguageController;
  let languageService: jest.Mocked<LanguageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageController],
      providers: [
        {
          provide: LanguageService,
          useValue: {
            getSupportedLanguages: jest.fn(),
            setLanguageEnabled: jest.fn(),
          },
        },
      ],
    }).compile();

    languageController = module.get<LanguageController>(LanguageController);
    languageService = module.get(LanguageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listLanguage', () => {
    it('should return a list of languages', async () => {
      const mockLanguages: LanguageDto[] = [{ key: 'en' }, { key: 'cn' }];

      languageService.getSupportedLanguages.mockResolvedValue(mockLanguages);

      const result = await languageController.listLanguage();

      expect(result).toEqual(mockLanguages);
      expect(languageService.getSupportedLanguages).toHaveBeenCalledTimes(1);
    });
  });
});
