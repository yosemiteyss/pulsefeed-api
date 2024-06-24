import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly dbHealth: TypeOrmHealthIndicator,
    private readonly memoryHealth: MemoryHealthIndicator,
  ) {}

  @Get('/check')
  @HealthCheck()
  @ApiOperation({ description: 'Services health check' })
  check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.dbHealth.pingCheck('database'),
      () => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
