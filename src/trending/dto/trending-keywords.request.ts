import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TrendingKeywordsRequest {
  /**
   * Return keywords with the given language key.
   */
  @IsString()
  @IsNotEmpty()
  readonly languageKey: string;

  /**
   * (Optional): returns keywords of the given category.
   * When not set, return keywords from all categories.
   */
  @IsString()
  @IsOptional()
  readonly categoryKey?: string;
}
