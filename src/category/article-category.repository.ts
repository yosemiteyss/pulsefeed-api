import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCategoryEntity } from '@common/db';
import { ArticleCategory } from '@common/model';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleCategoryRepository {
  constructor(
    @InjectRepository(ArticleCategoryEntity)
    private readonly categoryRepository: Repository<ArticleCategoryEntity>,
  ) {}

  async findEnabled(): Promise<ArticleCategoryEntity[]> {
    return this.categoryRepository.find({ where: { enabled: true } });
  }

  async find(key: string): Promise<ArticleCategoryEntity> {
    return this.categoryRepository.findOneBy({ key });
  }

  async save(category: ArticleCategory): Promise<ArticleCategoryEntity> {
    return this.categoryRepository.save(category);
  }
}
