import { CategoryItem } from '../model';

export class CategoryDto {
  constructor(key: string, name: string, priority: number) {
    this.key = key;
    this.name = name;
    this.priority = priority;
  }

  readonly key: string;
  readonly name: string;
  readonly priority: number;

  static fromModel(model: CategoryItem): CategoryDto {
    return {
      key: model.key,
      name: model.title,
      priority: model.priority,
    };
  }
}
