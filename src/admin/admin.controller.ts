import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnableLanguageDto, LanguageService } from '../language';
import { EnableCategoryDto, CategoryService } from '../category';
import { EnableSourceDto, SourceService } from '../source';
import { ApiKeyService } from 'src/auth/api-key.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';
import { CreateApiKeyDto } from '../auth';

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
  async enableSource(@Body() { id, enabled }: EnableSourceDto) {
    await this.sourceService.setSourceEnabled(id, enabled);
  }

  @Post('/category-enable')
  @ApiOperation({ description: 'Enable or disable article category' })
  async enableCategory(@Body() { key, enabled }: EnableCategoryDto) {
    await this.categoryService.setCategoryEnabled(key, enabled);
  }

  @Post('/language-enable')
  @ApiOperation({ description: 'Enable or disable language' })
  async enableLanguage(@Body() { key, enabled }: EnableLanguageDto) {
    await this.languageService.setLanguageEnabled(key, enabled);
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
