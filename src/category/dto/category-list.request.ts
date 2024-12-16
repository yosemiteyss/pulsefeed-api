import { IsString } from 'class-validator';

export class CategoryListRequest {
  /**
   * The language key.
   */
  @IsString()
  readonly languageKey: string;
}
