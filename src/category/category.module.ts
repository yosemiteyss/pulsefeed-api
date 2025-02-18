import { RepositoryModule } from '@pulsefeed/common';
import { CategoryController } from './controller';
import { CategoryService } from './service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RepositoryModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
