import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryListRequest {
  /**
   * The language key.
   */
  @IsString()
  @IsNotEmpty()
  readonly languageKey: string;
}
