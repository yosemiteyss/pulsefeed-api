import { ArticleResponse } from '../../article';

export class TrendingArticlesResponse {
  constructor(articles: ArticleResponse[]) {
    this.articles = articles;
  }

  /**
   * Article list.
   */
  readonly articles: ArticleResponse[];
}
