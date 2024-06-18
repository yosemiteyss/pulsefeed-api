import { ArticleCategoryService } from '../service/article-category.service';
import { ArticleCategoryDto } from '../dto/article-category.dto';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Cacheable } from 'nestjs-cacheable';

@ApiTags('Article Category')
@Controller('article-category')
@UseGuards(ApiKeyGuard)
export class ArticleCategoryController {
  constructor(private readonly categoryService: ArticleCategoryService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get article categories' })
  @Cacheable({
    key: 'category:list',
    namespace: 'pf',
  })
  async listCategory(): Promise<ArticleCategoryDto[]> {
    return this.categoryService.getCategoryList();
  }
}
