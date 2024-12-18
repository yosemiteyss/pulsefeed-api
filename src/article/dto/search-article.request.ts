import { IsNotEmpty, IsString } from 'class-validator';
import { PageRequest } from '@pulsefeed/common';

export class SearchArticleRequest extends PageRequest {
  /**
   * The language key.
   */
  @IsString()
  @IsNotEmpty()
  readonly languageKey: string;

  /**
   * Search term.
   */
  @IsString()
  @IsNotEmpty()
  readonly term: string;
}
