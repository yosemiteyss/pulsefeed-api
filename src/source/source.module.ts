import { SourceRepository } from '@pulsefeed/common';
import { SourceController } from './controller';
import { SourceService } from './service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SourceController],
  providers: [SourceService, SourceRepository],
  exports: [SourceService],
})
export class SourceModule {}
