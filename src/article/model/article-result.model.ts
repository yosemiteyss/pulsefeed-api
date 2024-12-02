import { Article, Source } from '@pulsefeed/common';

/**
 * Intermediate model used for mapping between article entity and dto.
 */
export interface ArticleResult {
  readonly article: Article;
  readonly source: Source;
}
