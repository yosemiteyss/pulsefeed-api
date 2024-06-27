import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { EnableLanguageDto } from '../language/dto/enable-language.dto';
import { EnableCategoryDto } from '../category/dto/enable-category.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnableSourceDto } from '../source/dto/enable-source.dto';
import { CreateApiKeyDto } from '../auth/dto/create-api-key.dto';
import { CategoryService } from '../category/category.service';
import { LanguageService } from '../language/language.service';
import { ApiKeyService } from 'src/auth/api-key.service';
import { SourceService } from '../source/source.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly sourceService: SourceService,
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
    private readonly healthCheckService: HealthCheckService,
    private readonly dbHealth: TypeOrmHealthIndicator,
    private readonly memoryHealth: MemoryHealthIndicator,
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

  @Get('/health-check')
  @HealthCheck()
  @ApiOperation({ description: 'Services health check' })
  healthCheck(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.dbHealth.pingCheck('database'),
      () => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
