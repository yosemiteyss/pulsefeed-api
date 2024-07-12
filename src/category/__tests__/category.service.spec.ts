import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { CategoryListRequestDto } from '../dto/category-list-request.dto';
import { CategoryRepository } from '../repository/category.repository';
import { ArticleCategory, ArticleCategoryTitle } from '@common/model';
import { EnableCategoryDto } from '../dto/enable-category.dto';
import { CategoryService } from '../category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoryDto } from '../dto/category.dto';
import { LoggerService } from '@common/logger';

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
            getCategoryTitlesByLang: jest.fn(),
            setCategoryEnabled: jest.fn(),
          },
        },
        {
          provide: LoggerService,
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
      const mockCategories: ArticleCategoryTitle[] = [
        { categoryKey: 'tech', title: 'Tech' },
        { categoryKey: 'health', title: 'Health' },
      ];

      const requestDto: CategoryListRequestDto = { language: 'en' };

      articleCategoryRepository.getCategoryTitlesByLang.mockResolvedValue(mockCategories);

      const result = await categoryService.getSupportedCategories(requestDto);

      const expected: CategoryDto[] = [
        { key: 'tech', name: 'Tech' },
        { key: 'health', name: 'Health' },
      ];

      expect(result).toEqual(expected);
      expect(articleCategoryRepository.getCategoryTitlesByLang).toHaveBeenCalledTimes(1);
      expect(articleCategoryRepository.getCategoryTitlesByLang).toHaveBeenCalledWith('en');
    });
  });

  describe('setCategoryEnabled', () => {
    it('should enable a category', async () => {
      const request: EnableCategoryDto = { key: 'tech', enabled: true };
      const mockCategory: ArticleCategory = { key: 'tech' };

      articleCategoryRepository.getCategoryByKey.mockResolvedValue(mockCategory);
      articleCategoryRepository.setCategoryEnabled.mockResolvedValue();

      await categoryService.setCategoryEnabled(request);

      expect(articleCategoryRepository.setCategoryEnabled).toHaveBeenCalledWith('tech', true);
    });

    it('should throw NotFoundException if category is not found', async () => {
      const request: EnableCategoryDto = { key: 'nonexistent', enabled: true };

      articleCategoryRepository.getCategoryByKey.mockResolvedValue(undefined);

      await expect(categoryService.setCategoryEnabled(request)).rejects.toThrow(NotFoundException);
    });
  });
});
