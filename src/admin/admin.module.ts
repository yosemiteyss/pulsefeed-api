import { AdminController } from './controller/admin.controller';
import { SourceModule } from '../source/source.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [SourceModule],
  controllers: [AdminController],
})
export class AdminModule {}
