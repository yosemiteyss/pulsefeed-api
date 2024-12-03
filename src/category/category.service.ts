import { Inject, Injectable, LoggerService, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ArticleCategoryEnum, CacheService, stringToEnum } from '@pulsefeed/common';
import { CACHE_KEY_CATEGORY_LIST, cacheKeyCategoryList } from './cache.constants';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CategoryRepository } from './repository';
import { CACHE_KEY_ARTICLE } from '../article';
import { LanguageService } from '../language';
import { ONE_DAY_IN_MS } from '../shared';
import { CategoryItem } from './model';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly languageService: LanguageService,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Load translated category list to cache on module init.
   */
  async onModuleInit() {
    await this.loadTranslatedCategoriesToCache();
  }

  /**
   * Return category list with translated title.
   * Get data from cache or load from db if cache missed.
   * @param langKey the key of the language.
   */
  async getTranslatedCategories(langKey: string): Promise<CategoryItem[]> {
    return this.cacheService.wrap(
      cacheKeyCategoryList(langKey),
      () => this.categoryRepository.getCategoriesByLang(langKey),
      ONE_DAY_IN_MS,
    );
  }

  /**
   * Return category with translated title.
   * @param categoryKey the key of the category.
   * @param languageKey the key of the language.
   */
  async getTranslatedCategory(categoryKey: string, languageKey: string): Promise<CategoryItem> {
    const categories = await this.getTranslatedCategories(languageKey);
    const category = categories.find((category) => category.key === categoryKey);

    if (!category) {
      this.logger.error(`category not found: ${categoryKey}`, CategoryService.name);
      throw new NotFoundException();
    }

    return category;
  }

  /**
   * Enable or disable category.
   * @param key the key of the category.
   * @param enabled true to enable category.
   */
  async setCategoryEnabled(key: string, enabled: boolean) {
    const category = await this.categoryRepository.getCategoryByKey(key);

    if (!category) {
      this.logger.error(`category not found: ${key}`, CategoryService.name);
      throw new NotFoundException();
    }

    await this.categoryRepository.setCategoryEnabled(category.key, enabled);

    await this.cacheService.delByPrefix(CACHE_KEY_CATEGORY_LIST);
    await this.cacheService.delByPrefix(CACHE_KEY_ARTICLE);
  }

  /**
   * Check if the given category key is supported.
   * @param key the key of the category.
   */
  isSupportedCategory(key: string): boolean {
    return stringToEnum(ArticleCategoryEnum, key) !== undefined;
  }

  /**
   * Load all translated categories to cache.
   * @private
   */
  private async loadTranslatedCategoriesToCache() {
    const languages = await this.languageService.getSupportedLanguages();
    for (const language of languages) {
      await this.getTranslatedCategories(language.key);
    }
  }
}
