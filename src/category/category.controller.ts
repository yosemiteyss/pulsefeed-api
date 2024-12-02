import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryListRequestDto } from './dto';
import { Cacheable } from 'nestjs-cacheable';
import { DEFAULT_TTL } from '../shared';
import { CategoryDto } from './dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get article categories' })
  @ApiOkResponse({ type: CategoryDto, isArray: true })
  @Cacheable({
    key: ({ language }: CategoryListRequestDto) => `pf:category:list:language:${language}`,
    ttl: DEFAULT_TTL,
  })
  async listCategory(@Body() { language }: CategoryListRequestDto): Promise<CategoryDto[]> {
    const categories = await this.categoryService.getSupportedCategories(language);
    return categories.map((category) => CategoryDto.fromModel(category));
  }
}
