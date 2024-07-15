import { CategoryListRequestDto } from './dto/category-list-request.dto';
import { CategoryRepository } from './repository/category.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableCategoryDto } from './dto/enable-category.dto';
import { ArticleCategoryEnum } from '@common/model';
import { CategoryDto } from './dto/category.dto';
import { LoggerService } from '@common/logger';
import { stringToEnum } from '@common/utils';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedCategories({ language }: CategoryListRequestDto): Promise<CategoryDto[]> {
    const categoryTitles = await this.categoryRepository.getCategoryWithTitleByLang(language);
    return categoryTitles.map((title) => ({
      key: title.key,
      name: title.title,
      priority: title.priority,
    }));
  }

  async setCategoryEnabled(request: EnableCategoryDto) {
    const { key, enabled } = request;
    const category = await this.categoryRepository.getCategoryByKey(key);

    if (!category) {
      this.logger.warn(CategoryService.name, `category not found: ${key}`);
      throw new NotFoundException();
    }

    await this.categoryRepository.setCategoryEnabled(category.key, enabled);
  }

  isSupportedCategory(category: string): boolean {
    return stringToEnum(ArticleCategoryEnum, category) !== undefined;
  }
}
