import { IsBoolean, IsString } from 'class-validator';

export class EnableLanguageDto {
  @IsString()
  readonly key: string;

  @IsBoolean()
  readonly enabled: boolean;
}
