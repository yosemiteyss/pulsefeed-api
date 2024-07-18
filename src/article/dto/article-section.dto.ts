import { CategoryDto } from '../../category/dto/category.dto';
import { ArticleDto } from './article.dto';

export class ArticleSectionDto {
  readonly category: CategoryDto;
  readonly articles: ArticleDto[];
  readonly nextSectionKey?: string;
}
