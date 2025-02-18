import { RepositoryModule } from '@pulsefeed/common';
import { SourceController } from './controller';
import { SourceService } from './service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RepositoryModule],
  controllers: [SourceController],
  providers: [SourceService],
  exports: [SourceService],
})
export class SourceModule {}
