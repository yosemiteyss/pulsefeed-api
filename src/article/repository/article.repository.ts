import { PrismaService } from '@pulsefeed/common';
import { ArticleMapper } from './article.mapper';
import { ArticleListOptions } from '../model';
import { Injectable } from '@nestjs/common';
import { ArticleResult } from '../model';
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
    excludeIds,
    searchTerm,
  }: ArticleListOptions): Promise<[ArticleResult[], number]> {
    const whereClause: Prisma.ArticleWhereInput = {
      publishedAt: {
        lt: publishedBefore,
      },

      languages: {
        some: {
          languageKey: language,
        },
      },
    };

    if (category) {
      whereClause.category = {
        key: category,
      };
    }

    if (sourceId) {
      whereClause.source = {
        id: sourceId,
        enabled: true,
      };
    }

    // Search by title or description
    if (searchTerm && searchTerm.length > 0) {
      whereClause.OR = [
        { title: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ];
    }

    if (excludeIds) {
      whereClause.id = {
        notIn: excludeIds,
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
        publishedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return [entities.map((article) => this.articleMapper.articleEntityToModel(article)), total];
  }
}
