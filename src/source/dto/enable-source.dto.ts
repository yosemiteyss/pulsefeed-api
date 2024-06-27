import { IsBoolean, IsString } from 'class-validator';

export class EnableSourceDto {
  @IsString()
  readonly id: string;

  @IsBoolean()
  readonly enabled: boolean;
}
