import { CategoryResponse } from './category.response';

export class CategoryListResponse {
  constructor(categories: CategoryResponse[]) {
    this.categories = categories;
  }

  /**
   * List of categories.
   */
  readonly categories: CategoryResponse[];
}
