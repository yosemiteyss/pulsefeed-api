import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryListRequestDto, CategoryDto } from './dto';
import { Body, Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get article categories' })
  @ApiOkResponse({ type: CategoryDto, isArray: true })
  async listCategory(@Body() { language }: CategoryListRequestDto): Promise<CategoryDto[]> {
    const categories = await this.categoryService.getTranslatedCategories(language);
    return categories.map((category) => CategoryDto.fromModel(category));
  }
}
