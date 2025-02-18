import { TerminusModule } from '@nestjs/terminus';
import { AdminController } from './controller';
import { CategoryModule } from '../category';
import { LanguageModule } from '../language';
import { SourceModule } from '../source';
import { Module } from '@nestjs/common';

@Module({
  imports: [TerminusModule, SourceModule, CategoryModule, LanguageModule],
  controllers: [AdminController],
})
export class AdminModule {}
