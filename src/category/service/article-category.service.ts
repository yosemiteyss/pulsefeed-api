import { ArticleCategoryDto } from '../dto/article-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCategoryEntity } from '@common/db';
import { LoggerService } from '@common/logger';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategoryEntity)
    private readonly categoryRepository: Repository<ArticleCategoryEntity>,
    private readonly logger: LoggerService,
  ) {}

  async getCategoryList(): Promise<ArticleCategoryDto[]> {
    const categories = await this.categoryRepository.find();
    this.logger.log(ArticleCategoryService.name, `getCategoryList: ${categories.length}`);

    return categories.map((category) => ({ name: category.key }));
  }
}
