export class TrendingKeywordsResponse {
  constructor(keywords: string[]) {
    this.keywords = keywords;
  }

  /**
   * Keywords list.
   */
  readonly keywords: string[];
}
