import { PageRequest } from '@pulsefeed/common';
import { IsString } from 'class-validator';

export class CategoryFeedRequest extends PageRequest {
  /**
   * Returns articles with the given language key.
   */
  @IsString()
  readonly languageKey: string;

  /**
   * (Optional): returns articles of the given category.
   * When it's not set, returns articles from all categories.
   */
  @IsString()
  readonly categoryKey: string;
}
