import { IsNotEmpty, IsString } from 'class-validator';

export class RelatedArticlesRequest {
  @IsString()
  @IsNotEmpty()
  readonly articleId: string;
}
