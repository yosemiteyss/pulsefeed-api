import { ArticleData, ArticleFilter } from '../model';
import { PrismaService } from '@pulsefeed/common';
import { ArticleMapper } from './article.mapper';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly articleMapper = new ArticleMapper();

  /**
   * Return articles which match the given filtering options.
   * @param filter filtering options.
   * @returns array of article data and number of articles
   */
  async getArticles(filter: ArticleFilter): Promise<[ArticleData[], number]> {
    const whereClause: Prisma.ArticleWhereInput = {};

    // Retrieve only published articles.
    whereClause.isPublished = true;

    // Filter by publish date.
    whereClause.publishedAt = {
      lt: filter.publishedBefore,
    };

    // Filter by language.
    whereClause.languages = {
      some: {
        languageKey: filter.languageKey,
      },
    };

    // Filter by category.
    if (filter.categoryKey) {
      whereClause.category = {
        key: filter.categoryKey,
      };
    }

    // Filter by source.
    if (filter.sourceId) {
      whereClause.source = {
        id: filter.sourceId,
        enabled: true,
      };
    }

    // Search by title or description
    if (filter.searchTerm && filter.searchTerm.length > 0) {
      whereClause.OR = [
        { title: { contains: filter.searchTerm } },
        { description: { contains: filter.searchTerm } },
      ];
    }

    // Exclude articles with the given ids.
    if (filter.excludeIds) {
      whereClause.id = {
        notIn: filter.excludeIds,
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
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
    });

    const models = entities.map((article) => this.articleMapper.entityToModel(article));
    return [models, total];
  }
}
