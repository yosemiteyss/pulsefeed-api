import { IsNotEmpty, IsString } from 'class-validator';
import { PageRequest } from '@pulsefeed/common';

export class CategoryFeedRequest extends PageRequest {
  /**
   * Returns articles with the given language key.
   */
  @IsString()
  @IsNotEmpty()
  readonly languageKey: string;

  /**
   * (Optional): returns articles of the given category.
   * When it's not set, returns articles from all categories.
   */
  @IsString()
  @IsNotEmpty()
  readonly categoryKey: string;
}
