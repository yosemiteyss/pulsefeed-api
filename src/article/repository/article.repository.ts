import { Prisma, Article as ArticleEntity } from '@prisma/client';
import { Article, PrismaService } from '@pulsefeed/common';
import { ArticleData, ArticleFilter } from '../model';
import { ArticleMapper } from './article.mapper';
import { Injectable } from '@nestjs/common';

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
      gt: filter.publishedAfter,
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

    // Filter articles by the given keywords.
    if (filter.keywords) {
      whereClause.keywords = {
        hasSome: filter.keywords,
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

    const models = entities.map((article) => this.articleMapper.payloadToModel(article));
    return [models, total];
  }

  /**
   * Get article by id.
   * @param articleId the article id.
   */
  async getArticle(articleId: string): Promise<ArticleData | undefined> {
    const entity = await this.prismaService.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        source: true,
        category: true,
        languages: true,
      },
    });

    if (!entity) {
      return undefined;
    }

    return this.articleMapper.payloadToModel(entity);
  }

  /**
   * Given an article, find other articles with similar keywords.
   * @param articleId the article id.
   * @param limit number of similar articles.
   * @param similarity cosine similarity score.
   */
  async getArticlesWithSimilarKeywords(
    articleId: string,
    limit: number = 10,
    similarity: number = 0.4,
  ): Promise<Article[]> {
    const articleData = await this.getArticle(articleId);
    const articleKeywords = articleData?.article?.keywords ?? [];

    if (articleKeywords.length === 0) {
      return [];
    }

    const entities = await this.prismaService.$queryRaw<ArticleEntity[]>`
        WITH similarity_cte AS (SELECT *,
                                       (
                                           array_length(array(SELECT unnest(keywords) INTERSECT SELECT unnest(${articleKeywords}::text[])), 1)
                                               /
                                           sqrt(array_length(keywords, 1) * ${articleKeywords.length})
                                           ) AS similarity_score
                                FROM articles
                                WHERE id != ${articleId}
            )
        SELECT *
        FROM similarity_cte
        WHERE similarity_score >= ${similarity}
        ORDER BY similarity_score DESC
            LIMIT ${limit}
    `;

    return entities.map((entity) => this.articleMapper.entityToModel(entity));
  }
}
