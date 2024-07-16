import { CategoryDto } from '../../category/dto/category.dto';
import { ArticleDto } from './article.dto';

export class HomeFeedDto {
  readonly section: FeedSection;
  readonly nextSectionKey?: string;
}

export class FeedSection {
  readonly category: CategoryDto;
  readonly articles: ArticleDto[];
}
