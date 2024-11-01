import { Source } from '@pulsefeed/common';

export class SourceDto {
  readonly id: string;
  readonly title: string;
  readonly link: string;
  readonly image?: string;
  readonly description?: string;

  static fromModel(model: Source): SourceDto {
    const { id, title, link, image, description } = model;
    return { id, title, link, image, description };
  }
}
