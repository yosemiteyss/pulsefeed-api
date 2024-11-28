import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './repository/category.repository';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CategoryResult } from './type/category-result';
import { ArticleCategoryEnum } from '@pulsefeed/common';
import { stringToEnum } from '@pulsefeed/common';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async getSupportedCategories(langKey: string): Promise<CategoryResult[]> {
    return await this.categoryRepository.getCategoryByLang(langKey);
  }

  async setCategoryEnabled(key: string, enabled: boolean) {
    const category = await this.categoryRepository.getCategoryByKey(key);

    if (!category) {
      this.logger.warn(`category not found: ${key}`, CategoryService.name);
      throw new NotFoundException();
    }

    await this.categoryRepository.setCategoryEnabled(category.key, enabled);
  }

  isSupportedCategory(key: string): boolean {
    return stringToEnum(ArticleCategoryEnum, key) !== undefined;
  }
}
