import { ArticleCategory, ArticleCategoryTitle } from '@pulsefeed/common';

export class CategoryResponse {
  constructor(key: string, title: string, priority: number) {
    this.key = key;
    this.title = title;
    this.priority = priority;
  }

  readonly key: string;
  readonly title: string;
  readonly priority: number;

  static fromModel(category: ArticleCategory, title: ArticleCategoryTitle): CategoryResponse {
    return new CategoryResponse(title.categoryKey, title.title, category.priority);
  }
}
