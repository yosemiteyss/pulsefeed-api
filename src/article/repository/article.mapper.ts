import { Article as ArticleEntity, Source as SourceEntity } from '@prisma/client';
import { ArticleResult } from '../type/article-result';
import { ArticleCategoryEnum } from '@common/model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleMapper {
  articleEntityToModel(article: ArticleEntity, source: SourceEntity): ArticleResult {
    return {
      article: {
        id: article.id,
        title: article.title,
        link: article.link,
        description: article.description ?? undefined,
        image: article.image ?? undefined,
        keywords: article.keywords,
        publishedAt: article.publishedAt ?? undefined,
        category: article.categoryKey as ArticleCategoryEnum,
        sourceId: article.sourceId,
      },
      source: {
        id: source.id,
        title: source.title,
        link: source.link,
        image: source.image ?? undefined,
        description: source.description ?? undefined,
        languages: [],
      },
    };
  }
}
