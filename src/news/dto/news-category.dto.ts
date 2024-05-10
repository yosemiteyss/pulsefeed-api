import { NewsListStyle } from './news-list-style.enum';
import { NewsDto } from './news.dto';

export class NewsCategoryDto {
  readonly id?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly items?: NewsDto[];
  readonly color?: string;
  readonly style?: NewsListStyle;
  readonly expandable?: boolean;
}
