import { IsOptional, IsString } from 'class-validator';

export class LatestFeedRequest {
  /**
   * Returns articles with the given language key.
   */
  @IsString()
  readonly languageKey: string;

  /**
   * Next feed section identifier.
   */
  @IsString()
  @IsOptional()
  readonly feedSection?: string;
}
