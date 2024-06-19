import { IsBoolean, IsString } from 'class-validator';

export class EnableSourceDto {
  @IsString()
  readonly sourceId: string;

  @IsBoolean()
  readonly enabled: boolean;
}
