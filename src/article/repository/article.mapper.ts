import { ArticleCategoryEnum, LanguageEnum } from '@pulsefeed/common';
import { Injectable } from '@nestjs/common';
import { ArticleResult } from '../model';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleMapper {
  articleEntityToModel(
    entity: Prisma.ArticleGetPayload<{
      include: { source: true; category: true; languages: true };
    }>,
  ): ArticleResult {
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
        languages: [],
      },
    };
  }
}
