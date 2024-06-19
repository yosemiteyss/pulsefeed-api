import { IsBoolean, IsString } from 'class-validator';

export class EnableCategoryDto {
  @IsString()
  readonly key: string;

  @IsBoolean()
  readonly enabled: boolean;
}
