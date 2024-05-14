import { SourceDto } from '../../source/dto/source.dto';

export class NewsDto {
  readonly id?: string;
  readonly title?: string;
  readonly link?: string;
  readonly description?: string;
  readonly image?: string;
  readonly publishedAt?: Date;
  readonly source?: SourceDto;
}
