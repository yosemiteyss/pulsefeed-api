import { ArticleCategoryRepository, CacheModule, DatabaseModule } from '@pulsefeed/common';
import { CategoryController } from './controller';
import { CategoryService } from './service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [CategoryController],
  providers: [CategoryService, ArticleCategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
