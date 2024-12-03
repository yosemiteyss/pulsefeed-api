import { Inject, Injectable, LoggerService, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ArticleCategoryEnum, CacheService, stringToEnum } from '@pulsefeed/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { cacheKeyLangList } from './cache.constants';
import { CategoryRepository } from './repository';
import { LanguageService } from '../language';
import { DEFAULT_TTL } from '../shared';
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
      cacheKeyLangList(langKey),
      () => this.categoryRepository.getCategoryByLang(langKey),
      DEFAULT_TTL,
    );
  }

  /**
   * Enable or disable category.
   * @param key the key of the category.
   * @param enabled true to enable category.
   */
  async setCategoryEnabled(key: string, enabled: boolean) {
    const category = await this.categoryRepository.getCategoryByKey(key);

    if (!category) {
      this.logger.warn(`category not found: ${key}`, CategoryService.name);
      throw new NotFoundException();
    }

    await this.categoryRepository.setCategoryEnabled(category.key, enabled);
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
