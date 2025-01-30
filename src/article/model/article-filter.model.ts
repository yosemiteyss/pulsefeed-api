export interface ArticleFilter {
  /**
   * Page number.
   */
  readonly page: number;

  /**
   * Number of articles in a page.
   */
  readonly limit: number;

  /**
   * Returns articles with the given language key.
   */
  readonly languageKey: string;

  /**
   * Returns articles which are published before the given date.
   */
  readonly publishedBefore: Date;

  /**
   * Return articles which are published after the given date.
   */
  readonly publishedAfter?: Date;

  /**
   * (Optional): returns articles of the given category.
   * When it's not set, returns articles from all categories.
   */
  readonly categoryKey?: string;

  /**
   * (Optional): returns articles of the given source.
   * When it's not set, returns articles from all sources.
   */
  readonly sourceId?: string;

  /**
   * (Optional): returns articles excluding the ones match the given ids.
   * When it's not set, returns articles without exclusion.
   */
  readonly excludeIds?: string[];

  /**
   * (Optional): search articles with the given term.
   * When it's not set, returns all articles.
   */
  readonly searchTerm?: string;
}
