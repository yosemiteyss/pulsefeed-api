import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnableLanguageRequest, LanguageService } from '../language';
import { EnableCategoryRequest, CategoryService } from '../category';
import { EnableSourceRequest, SourceService } from '../source';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiKeyResponse, ApiKeyService } from '../auth';
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
  async createApiKey(): Promise<ApiKeyResponse> {
    return this.apiKeyService.createApiKey();
  }

  @Post('/source-enable')
  @ApiOperation({ description: 'Enable or disable article source' })
  async enableSource(@Body() { id, enabled }: EnableSourceRequest) {
    await this.sourceService.setSourceEnabled(id, enabled);
  }

  @Post('/category-enable')
  @ApiOperation({ description: 'Enable or disable article category' })
  async enableCategory(@Body() request: EnableCategoryRequest) {
    await this.categoryService.setCategoryEnabled(request);
  }

  @Post('/language-enable')
  @ApiOperation({ description: 'Enable or disable language' })
  async enableLanguage(@Body() request: EnableLanguageRequest) {
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
