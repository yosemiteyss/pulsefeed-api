import { IsBoolean, IsString } from 'class-validator';

export class EnableCategoryRequest {
  @IsString()
  readonly key: string;

  @IsBoolean()
  readonly enabled: boolean;
}
