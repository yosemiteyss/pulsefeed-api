import { SourceModule } from '../source/source.module';
import { AdminController } from './admin.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [SourceModule],
  controllers: [AdminController],
})
export class AdminModule {}
