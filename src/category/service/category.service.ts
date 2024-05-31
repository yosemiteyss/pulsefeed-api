import { CategoryDto } from '../dto/category.dto';
import { LoggerService } from '@common/logger';
import { NewsCategory } from '@common/model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly logger: LoggerService) {}

  async getCategoryList(): Promise<CategoryDto[]> {
    const categories = Object.values(NewsCategory);
    this.logger.log(CategoryService.name, `getCategoryList: ${categories.length}`);

    return categories.map((category) => ({ name: category }));
  }
}
