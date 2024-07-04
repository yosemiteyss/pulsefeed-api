import { CategoryDto } from '../../category/dto/category.dto';
import { SourceDto } from '../../source/dto/source.dto';
import { ArticleDto } from './article.dto';

export class FeaturedArticle {
  readonly headlineSection?: FeaturedArticleSection;
  readonly categorySection?: FeaturedArticleSection;
  readonly sourceSection?: FeaturedArticleSection;
  readonly listExcludes?: string[];
}

export class FeaturedArticleSection {
  readonly headline?: string;
  readonly category?: CategoryDto;
  readonly source?: SourceDto;
  readonly articles: ArticleDto[];
}
