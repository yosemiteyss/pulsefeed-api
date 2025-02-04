import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TrendingArticlesRequest {
  /**
   * Return articles with the given language key.
   */
  @IsString()
  @IsNotEmpty()
  readonly languageKey: string;

  /**
   * (Optional): returns articles of the given category.
   * When not set, return articles from all categories.
   */
  @IsString()
  @IsOptional()
  readonly categoryKey?: string;
}
