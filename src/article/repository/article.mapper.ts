import { ArticleCategoryEnum, LanguageEnum, PrismaClient } from '@pulsefeed/common';
import { ArticleData } from '../model';

export class ArticleMapper {
  entityToModel(
    entity: PrismaClient.Prisma.ArticleGetPayload<{
      include: { source: true; category: true; languages: true };
    }>,
  ): ArticleData {
    return {
      article: {
        id: entity.id,
        title: entity.title,
        link: entity.link,
        description: entity.description ?? undefined,
        image: entity.image ?? undefined,
        keywords: entity.keywords,
        publishedAt: entity.publishedAt ?? undefined,
        category: entity.categoryKey as ArticleCategoryEnum,
        sourceId: entity.sourceId,
        languages: entity.languages.map((language) => language.languageKey as LanguageEnum),
      },
      source: {
        id: entity.source.id,
        title: entity.source.title,
        link: entity.source.link,
        image: entity.source.image ?? undefined,
        description: entity.source.description ?? undefined,
        languages: entity.languages.map((language) => language.languageKey as LanguageEnum),
      },
      category: {
        key: entity.category.key,
        priority: entity.category.priority.toNumber(),
      },
    };
  }
}
