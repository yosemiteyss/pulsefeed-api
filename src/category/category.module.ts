import { ArticleCategoryRepository } from './article-category.repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, ArticleCategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
