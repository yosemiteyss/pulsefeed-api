import { CategoryService } from '../service/category.service';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from '../dto/category.dto';

@ApiTags('Category')
@Controller('category')
@UseGuards(ApiKeyGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get news categories' })
  async listCategory(): Promise<CategoryDto[]> {
    return this.categoryService.getCategoryList();
  }
}
