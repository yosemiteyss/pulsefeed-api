import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { CategoryListRequestDto } from '../dto/category-list-request.dto';
import { CategoryRepository } from '../repository/category.repository';
import { EnableCategoryDto } from '../dto/enable-category.dto';
import { CategoryService } from '../category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoryDto } from '../dto/category.dto';
import { ArticleCategory } from '@common/model';
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
            getCategoryWithTitleByLang: jest.fn(),
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
      const mockCategories: { key: string; title: string; priority: number }[] = [
        { key: 'tech', title: 'Tech', priority: 1 },
        { key: 'health', title: 'Health', priority: 1 },
      ];

      const requestDto: CategoryListRequestDto = { language: 'en' };

      articleCategoryRepository.getCategoryWithTitleByLang.mockResolvedValue(mockCategories);

      const result = await categoryService.getSupportedCategories(requestDto);

      const expected: CategoryDto[] = [
        { key: 'tech', name: 'Tech', priority: 1 },
        { key: 'health', name: 'Health', priority: 1 },
      ];

      expect(result).toEqual(expected);
      expect(articleCategoryRepository.getCategoryWithTitleByLang).toHaveBeenCalledTimes(1);
      expect(articleCategoryRepository.getCategoryWithTitleByLang).toHaveBeenCalledWith('en');
    });
  });

  describe('setCategoryEnabled', () => {
    it('should enable a category', async () => {
      const request: EnableCategoryDto = { key: 'tech', enabled: true };
      const mockCategory: ArticleCategory = { key: 'tech', priority: 1 };

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
