import { Source } from '@pulsefeed/common';

export class SourceResponse {
  constructor(id: string, title: string, link: string, imageUrl?: string, description?: string) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  readonly id: string;
  readonly title: string;
  readonly link: string;
  readonly imageUrl?: string;
  readonly description?: string;

  static fromModel(model: Source): SourceResponse {
    return {
      id: model.id,
      title: model.title,
      link: model.link,
      imageUrl: model.image,
      description: model.description,
    };
  }
}
