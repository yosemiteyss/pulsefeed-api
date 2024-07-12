import { CategoryListRequestDto } from './dto/category-list-request.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { DEFAULT_TTL } from '../shared/constants';
import { CategoryDto } from './dto/category.dto';
import { Cacheable } from 'nestjs-cacheable';

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
  async listCategory(@Body() request: CategoryListRequestDto): Promise<CategoryDto[]> {
    return this.categoryService.getSupportedCategories(request);
  }
}
