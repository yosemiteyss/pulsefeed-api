import { Source } from '@pulsefeed/common';

export class SourceResponse {
  constructor(id: string, title: string, link: string, imageUrl?: string, description?: string) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  /**
   * Source id.
   */
  readonly id: string;

  /**
   * Source title.
   */
  readonly title: string;

  /**
   * Source url.
   */
  readonly link: string;

  /**
   * Source image url.
   */
  readonly imageUrl?: string;

  /**
   * Source description.
   */
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
