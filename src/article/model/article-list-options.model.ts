/**
 * Options for filtering article list.
 */
export interface ArticleListOptions {
  readonly page: number;
  readonly limit: number;
  readonly language: string;
  readonly publishedBefore: Date;
  readonly category?: string;
  readonly sourceId?: string;
  readonly excludeIds?: string[];
  readonly searchTerm?: string;
}
