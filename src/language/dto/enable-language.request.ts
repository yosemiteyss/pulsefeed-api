import { IsBoolean, IsString } from 'class-validator';

export class EnableLanguageRequest {
  @IsString()
  readonly key: string;

  @IsBoolean()
  readonly enabled: boolean;
}
