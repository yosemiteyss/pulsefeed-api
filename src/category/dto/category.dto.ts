import { CategoryResult } from '../type/category-result';

export class CategoryDto {
  readonly key: string;
  readonly name: string;
  readonly priority: number;

  static fromModel(model: CategoryResult): CategoryDto {
    return {
      key: model.key,
      name: model.title,
      priority: model.priority,
    };
  }
}
