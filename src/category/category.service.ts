import { ArticleCategoryRepository } from './article-category.repository';
import { CategoryListRequestDto } from './dto/category-list-request.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableCategoryDto } from './dto/enable-category.dto';
import { ArticleCategoryEnum } from '@common/model';
import { CategoryDto } from './dto/category.dto';
import { LoggerService } from '@common/logger';
import { stringToEnum } from '@common/utils';

@Injectable()
export class CategoryService {
  constructor(
    private readonly articleCategoryRepository: ArticleCategoryRepository,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedCategories({ language }: CategoryListRequestDto): Promise<CategoryDto[]> {
    const entities = await this.articleCategoryRepository.findTitlesEnabled(language);
    return entities.map((category) => ({
      key: category.categoryKey,
      name: category.title,
    }));
  }

  async setCategoryEnabled(request: EnableCategoryDto) {
    const { key, enabled } = request;
    const category = await this.articleCategoryRepository.find(key);

    if (!category) {
      this.logger.warn(CategoryService.name, `category: ${key} is not found`);
      throw new NotFoundException();
    }

    category.enabled = enabled;

    await this.articleCategoryRepository.save(category);
  }

  isSupportedCategory(category: string): boolean {
    return stringToEnum(ArticleCategoryEnum, category) !== undefined;
  }
}
