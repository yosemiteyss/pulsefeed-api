import { SourceDto } from '../../source/dto/source.dto';
import { ArticleResult } from '../type/article-result';

export class ArticleDto {
  readonly id: string;
  readonly title: string;
  readonly link: string;
  readonly description?: string;
  readonly image?: string;
  readonly publishedAt?: Date;
  readonly source: SourceDto;

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
