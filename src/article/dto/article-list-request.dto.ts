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

  @IsString()
  @IsOptional()
  readonly searchTerm?: string;

  @IsBoolean()
  @IsOptional()
  readonly excludeFeedArticles?: boolean;
}
