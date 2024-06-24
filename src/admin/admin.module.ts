import { CategoryModule } from '../category/category.module';
import { LanguageModule } from '../language/language.module';
import { SourceModule } from '../source/source.module';
import { AdminController } from './admin.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [SourceModule, CategoryModule, LanguageModule],
  controllers: [AdminController],
})
export class AdminModule {}
