import { IsString } from 'class-validator';

export class CategoryListRequestDto {
  @IsString()
  readonly language: string;
}
