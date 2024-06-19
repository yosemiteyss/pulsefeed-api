import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableCategoryDto } from './enable-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCategoryEntity } from '@common/db';
import { CategoryDto } from '../dto/category.dto';
import { LoggerService } from '@common/logger';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ArticleCategoryEntity)
    private readonly categoryRepository: Repository<ArticleCategoryEntity>,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedCategories(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find({ where: { enabled: true } });
    return categories.map((category) => ({ name: category.key }));
  }

  async setCategoryEnabled(request: EnableCategoryDto) {
    const { key, enabled } = request;
    const category = await this.categoryRepository.findOneBy({ key });

    if (!category) {
      this.logger.warn(CategoryService.name, `category: ${key} is not found`);
      throw new NotFoundException();
    }

    category.enabled = enabled;

    await this.categoryRepository.save(category);
  }
}
