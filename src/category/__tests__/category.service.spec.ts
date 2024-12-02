import { CategoryRepository } from '../repository/category.repository';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CategoryService } from '../category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCategory } from '@pulsefeed/common';
import { NotFoundException } from '@nestjs/common';
import { mockLoggerService } from "../../shared/mock/logger.service.mock";

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let articleCategoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            getCategoryByKey: jest.fn(),
            getEnabledCategories: jest.fn(),
            getCategoryByLang: jest.fn(),
            setCategoryEnabled: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    articleCategoryRepository = module.get(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSupportedCategories', () => {
    it('should return a list of supported categories', async () => {
      const mockCategories: { key: string; title: string; priority: number }[] = [
        { key: 'tech', title: 'Tech', priority: 1 },
        { key: 'health', title: 'Health', priority: 1 },
      ];

      articleCategoryRepository.getCategoryByLang.mockResolvedValue(mockCategories);

      const result = await categoryService.getSupportedCategories('en');

      expect(result).toEqual(mockCategories);
      expect(articleCategoryRepository.getCategoryByLang).toHaveBeenCalledTimes(1);
      expect(articleCategoryRepository.getCategoryByLang).toHaveBeenCalledWith('en');
    });
  });

  describe('setCategoryEnabled', () => {
    it('should enable a category', async () => {
      const mockCategory: ArticleCategory = { key: 'tech', priority: 1 };

      articleCategoryRepository.getCategoryByKey.mockResolvedValue(mockCategory);
      articleCategoryRepository.setCategoryEnabled.mockResolvedValue();

      await categoryService.setCategoryEnabled('tech', true);

      expect(articleCategoryRepository.setCategoryEnabled).toHaveBeenCalledWith('tech', true);
    });

    it('should throw NotFoundException if category is not found', async () => {
      articleCategoryRepository.getCategoryByKey.mockResolvedValue(undefined);

      await expect(categoryService.setCategoryEnabled('invalid', true)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
