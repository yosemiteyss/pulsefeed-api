import {
  ArticleCategory,
  ArticleCategoryRepository,
  CacheService,
  ONE_DAY_IN_MS,
} from '@pulsefeed/common';
import { CategoryListResponse, CategoryResponse } from '../../dto';
import { LoggerService, NotFoundException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CategoryService } from '../category.service';
import { ResponseCacheKeys } from '../../../shared';
import { Test } from '@nestjs/testing';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: DeepMockProxy<ArticleCategoryRepository>;
  let cacheService: DeepMockProxy<CacheService>;
  let loggerService: DeepMockProxy<LoggerService>;

  beforeEach(async () => {
    categoryRepository = mockDeep<ArticleCategoryRepository>();
    cacheService = mockDeep<CacheService>();
    loggerService = mockDeep<LoggerService>();

    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: ArticleCategoryRepository,
          useValue: categoryRepository,
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

    categoryService = module.get<CategoryService>(CategoryService);
  });

  describe('getCategoryListResponse', () => {
    it('should get cached categories', async () => {
      const mockedCategories: CategoryResponse[] = [new CategoryResponse('key', 'title', 1)];
      cacheService.wrap.mockResolvedValue(mockedCategories);

      const languageKey = 'en';
      const cacheKey = ResponseCacheKeys.CATEGORY_LIST + `:languageKey:${languageKey}`;
      const result = await categoryService.getCategoryListResponse({ languageKey });
      expect(cacheService.wrap).toHaveBeenCalledWith(cacheKey, expect.any(Function), ONE_DAY_IN_MS);

      const response = new CategoryListResponse(mockedCategories);
      expect(result).toEqual(response);
    });
  });

  describe('setCategoryEnabled', () => {
    it('should set category enabled, and clear cache', async () => {
      const category: ArticleCategory = { key: 'key', priority: 1 };
      categoryRepository.getCategory.mockResolvedValue(category);
      await categoryService.setCategoryEnabled({ key: category.key, enabled: false });
      expect(categoryRepository.setCategoryEnabled).toHaveBeenCalledWith(category.key, false);
      expect(cacheService.deleteByPrefix).toHaveBeenCalledWith(
        ResponseCacheKeys.CATEGORY_LIST,
        true,
      );
    });

    it('should throw NotFoundException if category is not found', async () => {
      const category: ArticleCategory = { key: 'key', priority: 1 };
      categoryRepository.getCategory.mockResolvedValue(undefined);
      await expect(
        categoryService.setCategoryEnabled({ key: category.key, enabled: false }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
