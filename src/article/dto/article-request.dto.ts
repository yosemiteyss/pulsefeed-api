import { IsString } from 'class-validator';
import { PageRequest } from '@common/dto';

export class ArticleRequestDto extends PageRequest {
  @IsString()
  readonly category: string;

  @IsString()
  readonly language: string;

  @IsString()
  readonly sourceId?: string;
}
