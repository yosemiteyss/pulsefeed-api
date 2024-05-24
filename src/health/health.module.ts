import { HealthController } from './controller/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { Module } from '@nestjs/common';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
