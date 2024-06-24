import { ArticleCategoryRepository } from './article-category.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableCategoryDto } from './dto/enable-category.dto';
import { CategoryDto } from './dto/category.dto';
import { LoggerService } from '@common/logger';

@Injectable()
export class CategoryService {
  constructor(
    private readonly articleCategoryRepository: ArticleCategoryRepository,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedCategories(): Promise<CategoryDto[]> {
    const categories = await this.articleCategoryRepository.findEnabled();
    return categories.map((category) => ({ name: category.key }));
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
}
