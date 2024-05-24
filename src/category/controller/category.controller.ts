import { CategoryService } from '../service/category.service';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoryDto } from '../dto/category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
@UseGuards(ApiKeyGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategoryList(): Promise<CategoryDto[]> {
    return this.categoryService.getCategoryList();
  }
}
