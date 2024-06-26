import { ArticleCategoryRepository } from '../article-category.repository';
import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { EnableCategoryDto } from '../dto/enable-category.dto';
import { CategoryService } from '../category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LoggerService } from '@common/logger';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let articleCategoryRepository: jest.Mocked<ArticleCategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: ArticleCategoryRepository,
          useValue: {
            findEnabled: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    articleCategoryRepository = module.get(ArticleCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSupportedCategories', () => {
    it('should return a list of supported categories', async () => {
      const mockCategories = [
        { key: 'tech', enabled: true },
        { key: 'health', enabled: true },
      ];

      articleCategoryRepository.findEnabled.mockResolvedValue(mockCategories);

      const result = await categoryService.getSupportedCategories();

      expect(result).toEqual([{ name: 'tech' }, { name: 'health' }]);
      expect(articleCategoryRepository.findEnabled).toHaveBeenCalledTimes(1);
    });
  });

  describe('setCategoryEnabled', () => {
    it('should enable a category', async () => {
      const request: EnableCategoryDto = { key: 'tech', enabled: true };
      const mockCategory = { key: 'tech', enabled: false };

      articleCategoryRepository.find.mockResolvedValue(mockCategory);
      articleCategoryRepository.save.mockResolvedValue(undefined);

      await categoryService.setCategoryEnabled(request);

      expect(articleCategoryRepository.find).toHaveBeenCalledWith('tech');
      expect(articleCategoryRepository.save).toHaveBeenCalledWith({
        ...mockCategory,
        enabled: true,
      });
    });

    it('should throw NotFoundException if category is not found', async () => {
      const request: EnableCategoryDto = { key: 'nonexistent', enabled: true };

      articleCategoryRepository.find.mockResolvedValue(null);

      await expect(categoryService.setCategoryEnabled(request)).rejects.toThrow(NotFoundException);
    });
  });
});
