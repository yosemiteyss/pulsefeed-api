import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ArticleEntity } from '@common/db';

export interface ArticleFindOptions {
  readonly page: number;
  readonly limit: number;
  readonly category: string;
  readonly publishedBefore: Date;
}

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async find({
    page,
    limit,
    category,
    publishedBefore,
  }: ArticleFindOptions): Promise<[ArticleEntity[], number]> {
    return this.articleRepository.findAndCount({
      relations: {
        source: true,
        category: true,
      },
      where: {
        publishedAt: LessThan(publishedBefore),
        source: {
          enabled: true,
        },
        category: {
          key: category,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
