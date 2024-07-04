import { ArticleCategoryEntity, ArticleCategoryTitleEntity } from '@common/db';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ArticleCategory } from '@common/model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleCategoryRepository {
  constructor(
    @InjectRepository(ArticleCategoryEntity)
    private readonly categoryRepository: Repository<ArticleCategoryEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findEnabled(): Promise<ArticleCategoryEntity[]> {
    return this.categoryRepository.find({ where: { enabled: true } });
  }

  async findTitlesEnabled(languageKey: string): Promise<ArticleCategoryTitleEntity[]> {
    return this.dataSource.transaction(async (entityManager) => {
      const entities: ArticleCategoryTitleEntity[] = [];
      const categories = await entityManager.find(ArticleCategoryEntity, {
        where: {
          enabled: true,
        },
      });

      for (const category of categories) {
        const entity = await entityManager.findOne(ArticleCategoryTitleEntity, {
          where: {
            languageKey,
            categoryKey: category.key,
          },
        });

        entities.push(entity);
      }

      return entities;
    });
  }

  async find(key: string): Promise<ArticleCategoryEntity> {
    return this.categoryRepository.findOneBy({ key });
  }

  async save(category: ArticleCategory): Promise<ArticleCategoryEntity> {
    return this.categoryRepository.save(category);
  }
}
