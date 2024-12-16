import { ArticleCategory, ArticleCategoryTitle } from '@pulsefeed/common';

export class CategoryResponse {
  constructor(key: string, title: string, priority: number) {
    this.key = key;
    this.title = title;
    this.priority = priority;
  }

  /**
   * The category key.
   */
  readonly key: string;

  /**
   * The localized category title.
   */
  readonly title: string;

  /**
   * The category priority (from 0 to 1).
   */
  readonly priority: number;

  static fromModel(category: ArticleCategory, title: ArticleCategoryTitle): CategoryResponse {
    return new CategoryResponse(category.key, title.title, category.priority);
  }
}
