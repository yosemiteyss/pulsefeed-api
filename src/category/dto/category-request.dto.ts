import { IsString } from 'class-validator';

export class CategoryRequestDto {
  @IsString()
  readonly language: string;
}
