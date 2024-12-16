import { Article } from '@pulsefeed/common';

export class ArticleResponse {
  constructor(
    id: string,
    title: string,
    link: string,
    description: string,
    imageUrl: string,
    categoryKey: string,
    sourceId: string,
    publishedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.description = description;
    this.imageUrl = imageUrl;
    this.categoryKey = categoryKey;
    this.sourceId = sourceId;
    this.publishedAt = publishedAt;
  }

  /**
   * The article id.
   */
  readonly id: string;

  /**
   * The article title.
   */
  readonly title: string;

  /**
   * The article url.
   */
  readonly link: string;

  /**
   * The article description.
   */
  readonly description?: string;

  /**
   * The article image url.
   */
  readonly imageUrl?: string;

  /**
   * The category key of the article.
   */
  readonly categoryKey: string;

  /**
   * The source id of the article.
   */
  readonly sourceId: string;

  /**
   * The article publish date.
   */
  readonly publishedAt?: Date;

  static fromModel(article: Article): ArticleResponse {
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
