import { SourceDto } from '../../source';
import { ArticleResult } from '../model';

export class ArticleDto {
  constructor(
    id: string,
    title: string,
    link: string,
    description: string,
    image: string,
    source: SourceDto,
    publishedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.description = description;
    this.image = image;
    this.source = source;
    this.publishedAt = publishedAt;
  }

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
