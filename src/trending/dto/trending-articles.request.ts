import { IsNotEmpty, IsString } from 'class-validator';

export class TrendingArticlesRequest {
  /**
   * Return articles of the given language.
   */
  @IsString()
  @IsNotEmpty()
  readonly languageKey: string;

  /**
   * Return articles of the given category.
   */
  @IsString()
  @IsNotEmpty()
  readonly categoryKey: string;
}
