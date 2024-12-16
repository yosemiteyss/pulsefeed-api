import { ArticleResponse } from './article.response';
import { CategoryResponse } from '../../category';

export class ArticleSectionDto {
  readonly category: CategoryResponse;
  readonly articles: ArticleResponse[];
  readonly nextSectionKey?: string;
}
