import { IsString } from 'class-validator';

export class HomeFeedRequestDto {
  @IsString()
  readonly language: string;
}
