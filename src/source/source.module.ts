import { SourceRepository } from './repository/source.repository';
import { SourceMapper } from './repository/source.mapper';
import { SourceController } from './source.controller';
import { DatabaseModule } from '@pulsefeed/common';
import { SourceService } from './source.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [SourceController],
  providers: [SourceService, SourceRepository, SourceMapper],
  exports: [SourceService],
})
export class SourceModule {}
