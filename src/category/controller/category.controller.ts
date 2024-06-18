import { CategoryService } from '../service/category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from '../dto/category.dto';
import { Controller, Get } from '@nestjs/common';
import { Cacheable } from 'nestjs-cacheable';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get article categories' })
  @Cacheable({
    key: 'category:list',
    namespace: 'pf',
  })
  async listCategory(): Promise<CategoryDto[]> {
    return this.categoryService.getCategoryList();
  }
}
