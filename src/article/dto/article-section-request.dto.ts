import { IsOptional, IsString } from 'class-validator';

export class ArticleSectionRequestDto {
  @IsString()
  readonly language: string;

  @IsString()
  @IsOptional()
  readonly sectionKey?: string;
}
