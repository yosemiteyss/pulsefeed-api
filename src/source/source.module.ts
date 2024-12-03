import { CacheModule, DatabaseModule } from '@pulsefeed/common';
import { SourceRepository, SourceMapper } from './repository';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [SourceController],
  providers: [SourceService, SourceRepository, SourceMapper],
  exports: [SourceService],
})
export class SourceModule {}
