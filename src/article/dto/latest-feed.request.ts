import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LatestFeedRequest {
  /**
   * Returns articles with the given language key.
   */
  @IsString()
  @IsNotEmpty()
  readonly languageKey: string;

  /**
   * The identifier of the next feed section.
   */
  @IsString()
  @IsOptional()
  readonly feedSection?: string;
}
