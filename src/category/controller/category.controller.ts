import { CategoryListRequest, CategoryListResponse, CategoryResponse } from '../dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CategoryService } from '../service';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Get categories.
   * @param request category list request.
   */
  @Post('/list')
  @ApiOperation({ description: 'Get article categories' })
  @ApiOkResponse({ type: CategoryResponse, isArray: true })
  @HttpCode(200)
  async listCategory(@Body() request: CategoryListRequest): Promise<CategoryListResponse> {
    return this.categoryService.getCategoryListResponse(request);
  }
}
