import { IsBoolean, IsString } from 'class-validator';

export class EnableLanguageRequest {
  /**
   * The language key.
   */
  @IsString()
  readonly key: string;

  /**
   * Enable the language or not.
   */
  @IsBoolean()
  readonly enabled: boolean;
}
