import { ArticleCategoryRepository } from '@pulsefeed/common';
import { CategoryController } from './controller';
import { CategoryService } from './service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, ArticleCategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
