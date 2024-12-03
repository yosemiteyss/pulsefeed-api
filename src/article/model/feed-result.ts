import { ArticleResult } from './article-result.model';
import { CategoryItem } from '../../category';

export interface FeedResult {
  readonly articles: ArticleResult[];
  readonly category: CategoryItem;
  readonly nextSectionKey?: string;
}
