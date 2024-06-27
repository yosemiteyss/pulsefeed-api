import { SourceController } from './source.controller';
import { SourceRepository } from './source.repository';
import { SourceService } from './source.service';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [SourceController],
  providers: [SourceService, SourceRepository],
  exports: [SourceService],
})
export class SourceModule {}
