import { IsArray, IsOptional, IsString } from 'class-validator';
import { PageRequest } from '@common/dto';

export class ArticleListRequestDto extends PageRequest {
  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsString()
  readonly language: string;

  @IsString()
  @IsOptional()
  readonly sourceId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly excludeIds?: string[];
}
