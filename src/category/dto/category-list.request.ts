import { IsString } from 'class-validator';

export class CategoryListRequest {
  @IsString()
  readonly languageKey: string;
}
