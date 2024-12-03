import { CategoryRepository, CategoryMapper } from './repository';
import { CacheModule, DatabaseModule } from '@pulsefeed/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { LanguageModule } from '../language';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule, LanguageModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryMapper],
  exports: [CategoryService],
})
export class CategoryModule {}
