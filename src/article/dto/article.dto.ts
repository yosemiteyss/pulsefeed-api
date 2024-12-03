import { Article } from '@pulsefeed/common';

export class ArticleDto {
  constructor(
    id: string,
    title: string,
    link: string,
    description: string,
    image: string,
    categoryKey: string,
    sourceId: string,
    publishedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.description = description;
    this.imageUrl = image;
    this.categoryKey = categoryKey;
    this.sourceId = sourceId;
    this.publishedAt = publishedAt;
  }

  readonly id: string;
  readonly title: string;
  readonly link: string;
  readonly description?: string;
  readonly imageUrl?: string;
  readonly categoryKey: string;
  readonly sourceId: string;
  readonly publishedAt?: Date;

  static fromModel(article: Article): ArticleDto {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      imageUrl: article.image,
      link: article.link,
      categoryKey: article.category,
      sourceId: article.sourceId,
      publishedAt: article.publishedAt ?? article.createdAt,
    };
  }
}
