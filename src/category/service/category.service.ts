import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCategoryEntity } from '@common/db';
import { CategoryDto } from '../dto/category.dto';
import { LoggerService } from '@common/logger';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ArticleCategoryEntity)
    private readonly categoryRepository: Repository<ArticleCategoryEntity>,
    private readonly logger: LoggerService,
  ) {}

  async getCategoryList(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find();
    this.logger.log(CategoryService.name, `getCategoryList: ${categories.length}`);

    return categories.map((category) => ({ name: category.key }));
  }
}
