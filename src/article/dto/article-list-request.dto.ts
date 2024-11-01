import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PageRequest } from '@pulsefeed/common';

export class ArticleListRequestDto extends PageRequest {
  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsString()
  readonly language: string;

  @IsString()
  @IsOptional()
  readonly sourceId?: string;

  @IsBoolean()
  @IsOptional()
  readonly excludeHomeArticles?: boolean;
}
