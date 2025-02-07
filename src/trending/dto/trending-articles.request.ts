import { IsNotEmpty, IsString } from 'class-validator';

export class TrendingArticlesRequest {
  /**
   * Return articles with the given language key.
   */
  @IsString()
  @IsNotEmpty()
  readonly languageKey: string;
}
