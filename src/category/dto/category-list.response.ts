import { CategoryResponse } from './category.response';

export class CategoryListResponse {
  constructor(categories: CategoryResponse[]) {
    this.categories = categories;
  }

  readonly categories: CategoryResponse[];
}
