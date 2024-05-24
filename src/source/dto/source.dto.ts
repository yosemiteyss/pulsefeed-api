import { SourceEntity } from '@common/db';

export class SourceDto {
  readonly id?: string;
  readonly title?: string;
  readonly link?: string;
  readonly image?: string;
  readonly description?: string;

  static fromEntity(entity: SourceEntity): SourceDto {
    const { id, title, link, image, description } = entity;
    return { id, title, link, image, description };
  }
}
