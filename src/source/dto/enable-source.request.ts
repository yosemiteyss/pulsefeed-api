import { IsBoolean, IsString } from 'class-validator';

export class EnableSourceRequest {
  @IsString()
  readonly id: string;

  @IsBoolean()
  readonly enabled: boolean;
}
