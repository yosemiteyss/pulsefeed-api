import { Source } from '@pulsefeed/common';

export class SourceDto {
  constructor(id: string, title: string, link: string, image?: string, description?: string) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.imageUrl = image;
    this.description = description;
  }

  readonly id: string;
  readonly title: string;
  readonly link: string;
  readonly imageUrl?: string;
  readonly description?: string;

  static fromModel(model: Source): SourceDto {
    const { id, title, link, image, description } = model;
    return { id, title, link, imageUrl: image, description };
  }
}
