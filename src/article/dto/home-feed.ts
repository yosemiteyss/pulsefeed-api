import { CategoryDto } from '../../category/dto/category.dto';
import { ArticleDto } from './article.dto';

export class HomeFeedDto {
  readonly sections?: HomeFeedSection[];
  readonly excludeArticleIds?: string[];
}

export class HomeFeedSection {
  readonly category?: CategoryDto;
  readonly articles: ArticleDto[];
}
