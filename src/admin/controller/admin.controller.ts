import { EnableCategoryDto } from '../../category/service/enable-category.dto';
import { EnableLanguageDto } from '../../language/dto/enable-language.dto';
import { CategoryService } from '../../category/service/category.service';
import { LanguageService } from '../../language/service/language.service';
import { EnableSourceDto } from '../../source/dto/enable-source.dto';
import { SourceService } from '../../source/service/source.service';
import { CreateApiKeyDto } from '../../auth/dto/create-api-key.dto';
import { ApiKeyService } from '../../auth/service/api-key.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guard/admin.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly sourceService: SourceService,
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
  ) {}

  @Post('/create-api-key')
  @ApiOperation({ description: 'Create a new api key' })
  async createApiKey(): Promise<CreateApiKeyDto> {
    const key = await this.apiKeyService.createKey();
    return { key };
  }

  @Post('/source-enable')
  @ApiOperation({ description: 'Enable or disable article source' })
  async enableSource(@Body() request: EnableSourceDto) {
    await this.sourceService.setSourceEnabled(request);
  }

  @Post('/category-enable')
  @ApiOperation({ description: 'Enable or disable article category' })
  async enableCategory(@Body() request: EnableCategoryDto) {
    await this.categoryService.setCategoryEnabled(request);
  }

  @Post('/language-enable')
  @ApiOperation({ description: 'Enable or disable language' })
  async enableLanguage(@Body() request: EnableLanguageDto) {
    await this.languageService.setLanguageEnabled(request);
  }
}
