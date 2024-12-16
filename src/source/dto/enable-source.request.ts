import { IsBoolean, IsString } from 'class-validator';

export class EnableSourceRequest {
  /**
   * The source id.
   */
  @IsString()
  readonly id: string;

  /**
   * Enable the source or not.
   */
  @IsBoolean()
  readonly enabled: boolean;
}
