import { CategoryRepository } from './repository/category.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryResult } from './type/category-result';
import { ArticleCategoryEnum } from '@pulsefeed/common';
import { LoggerService } from '@pulsefeed/common';
import { stringToEnum } from '@pulsefeed/common';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedCategories(langKey: string): Promise<CategoryResult[]> {
    return await this.categoryRepository.getCategoryByLang(langKey);
  }

  async setCategoryEnabled(key: string, enabled: boolean) {
    const category = await this.categoryRepository.getCategoryByKey(key);

    if (!category) {
      this.logger.warn(CategoryService.name, `category not found: ${key}`);
      throw new NotFoundException();
    }

    await this.categoryRepository.setCategoryEnabled(category.key, enabled);
  }

  isSupportedCategory(key: string): boolean {
    return stringToEnum(ArticleCategoryEnum, key) !== undefined;
  }
}
