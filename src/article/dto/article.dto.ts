import { SourceDto } from '../../source/dto/source.dto';
import { ArticleResult } from '../type/article-result';

/**
 * Article DTO.
 */
export class ArticleDto {
  /**
   * The id of this article.
   */
  readonly id: string;

  /**
   * The title of this article.
   */
  readonly title: string;

  /**
   * The description of this article.
   */
  readonly description?: string;

  /**
   * The image URL of this article.
   */
  readonly imageUrl?: string;

  /**
   * The date when this article was published.
   */
  readonly publishedAt: Date;

  static fromModel({ article, source }: ArticleResult): ArticleDto {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      image: article.image,
      link: article.link,
      publishedAt: article.publishedAt ?? article.createdAt,
      source: SourceDto.fromModel(source),
    };
  }
}
