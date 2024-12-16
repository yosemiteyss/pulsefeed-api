import { Article, ArticleCategory, Source } from '@pulsefeed/common';

export interface ArticleData {
  readonly article: Article;
  readonly source: Source;
  readonly category: ArticleCategory;
}
