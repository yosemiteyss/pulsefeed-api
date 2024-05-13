import { SourceService } from './service/source.service';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  providers: [SourceService],
  exports: [SourceService],
})
export class SourceModule {}
