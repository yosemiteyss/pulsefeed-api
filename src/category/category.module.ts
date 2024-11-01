import { CategoryRepository } from './repository/category.repository';
import { CategoryMapper } from './repository/category.mapper';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from '@pulsefeed/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryMapper],
  exports: [CategoryService],
})
export class CategoryModule {}
