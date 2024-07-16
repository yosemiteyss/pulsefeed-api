import { IsOptional, IsString } from 'class-validator';

export class HomeFeedRequestDto {
  @IsString()
  readonly language: string;

  @IsString()
  @IsOptional()
  readonly sectionKey?: string;
}
