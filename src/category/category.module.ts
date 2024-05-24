import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
