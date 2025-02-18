import { ArticleRepository } from './repository';
import { Module } from '@nestjs/common';

@Module({
  providers: [ArticleRepository],
  exports: [ArticleRepository],
})
export class ArticleDataModule {}
