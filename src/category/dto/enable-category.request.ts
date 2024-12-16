import { IsBoolean, IsString } from 'class-validator';

export class EnableCategoryRequest {
  /**
   * The category key.
   */
  @IsString()
  readonly key: string;

  /**
   * Enable the category or not.
   */
  @IsBoolean()
  readonly enabled: boolean;
}
