import { ArticleFindOptions } from '../type/article-find-options';
import { ArticleResult } from '../type/article-result';
import { ArticleMapper } from './article.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/db';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly articleMapper: ArticleMapper,
  ) {}

  async getArticles({
    page,
    limit,
    category,
    language,
    sourceId,
    publishedBefore,
  }: ArticleFindOptions): Promise<[ArticleResult[], number]> {
    const whereClause: Prisma.ArticleWhereInput = {
      publishedAt: {
        lt: publishedBefore,
      },
      category: {
        key: category,
      },
      languages: {
        some: {
          key: language,
        },
      },
    };

    if (sourceId) {
      whereClause.source = {
        id: sourceId,
        enabled: true,
      };
    }

    const [entities, total] = await this.prismaService.article.findManyAndCount({
      include: {
        source: true,
        category: true,
        languages: true,
      },
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return [
      entities.map((article) => this.articleMapper.articleEntityToModel(article, article.source)),
      total,
    ];
  }
}
