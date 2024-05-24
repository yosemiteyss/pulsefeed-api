import { CategoryDto } from '../dto/category.dto';
import { NewsCategory } from '@common/model';

export class CategoryService {
  async getCategoryList(): Promise<CategoryDto[]> {
    const categories = Object.values(NewsCategory);
    return categories.map((category) => ({
      name: category,
    }));
  }
}
