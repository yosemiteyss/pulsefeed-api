import {
  CategoryResponse,
  CategoryListRequest,
  EnableCategoryRequest,
  CategoryListResponse,
} from '../dto';
import { ArticleCategoryRepository, CacheService, ONE_DAY_IN_MS } from '@pulsefeed/common';
import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { ResponseCacheKeys, toCacheKeyPart } from '../../shared';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: ArticleCategoryRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Return enabled category list with localized title.
   * @param languageKey the key of the language.
   * @returns cached category list response.
   */
  async getCategoryListResponse({
    languageKey,
  }: CategoryListRequest): Promise<CategoryListResponse> {
    const action = async () => {
      const categories = await this.categoryRepository.getEnabledCategories(false);
      const categoryTitles = await this.categoryRepository.getLocalizedCategoryTitles(
        languageKey,
        false,
      );
      return categories.map((category) => {
        return new CategoryResponse(
          category.key,
          categoryTitles[category.key].title,
          category.priority,
        );
      });
    };
    const cacheKey = ResponseCacheKeys.CATEGORY_LIST + toCacheKeyPart({ languageKey: languageKey });
    const categories = await this.cacheService.wrap(cacheKey, action, ONE_DAY_IN_MS);
    this.logger.log(`getCategoryListResponse, size: ${categories.length}`, CategoryService.name);

    return new CategoryListResponse(categories);
  }

  /**
   * Enable or disable category.
   * @param key the key of the category.
   * @param enabled true to enable category.
   */
  async setCategoryEnabled({ key, enabled }: EnableCategoryRequest) {
    const category = await this.categoryRepository.getCategory(key);
    if (!category) {
      this.logger.error(`category not found: ${key}`, CategoryService.name);
      throw new NotFoundException('category not found');
    }

    await this.categoryRepository.setCategoryEnabled(category.key, enabled);
    await this.cacheService.deleteByPrefix(ResponseCacheKeys.CATEGORY_LIST, true);
    this.logger.log(`setCategoryEnabled, key: ${key}, enabled: ${enabled}`, CategoryService.name);
  }
}
