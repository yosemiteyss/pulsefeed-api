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
import { AdminGuard } from './admin.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly sourceService: SourceService,
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
    private readonly healthCheckService: HealthCheckService,
    private readonly dbHealth: TypeOrmHealthIndicator,
    private readonly memoryHealth: MemoryHealthIndicator,
  ) {}

  /**
   * Enable or disable source.
   * @param request enable source request
   */
  @Post('/source-enable')
  async enableSource(@Body() request: EnableSourceRequest) {
    await this.sourceService.setSourceEnabled(request);
  }

  /**
   * Enable or disable article category.
   * @param request enable category request.
   */
  @Post('/category-enable')
  async enableCategory(@Body() request: EnableCategoryRequest) {
    await this.categoryService.setCategoryEnabled(request);
  }

  /**
   * Enable or disable language.
   * @param request enable language request.
   */
  @Post('/language-enable')
  async enableLanguage(@Body() request: EnableLanguageRequest) {
    await this.languageService.setLanguageEnabled(request);
  }

  /**
   * Service health check.
   */
  @Get('/health-check')
  @HealthCheck()
  healthCheck(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.dbHealth.pingCheck('database'),
      () => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
