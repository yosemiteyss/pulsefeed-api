import { ArticleCategoryRepository } from './repository/article-category.repository';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, ArticleCategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
