import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { Controller, Get } from '@nestjs/common';
import { Cacheable } from 'nestjs-cacheable';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get article categories' })
  @ApiOkResponse({ type: CategoryDto, isArray: true })
  @Cacheable({
    key: 'category:list',
    namespace: 'pf',
  })
  async listCategory(): Promise<CategoryDto[]> {
    return this.categoryService.getSupportedCategories();
  }
}
