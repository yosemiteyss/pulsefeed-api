import { IsString } from 'class-validator';
import { PageRequest } from '@common/dto';

export class NewsRequestDto extends PageRequest {
  @IsString()
  readonly category: string;
}
