import { SourceEntity } from '@common/db';

export class SourceDto {
  readonly id?: string;
  readonly title?: string;
  readonly link?: string;
  readonly image?: string;
  readonly description?: string;
  readonly enabled?: boolean;

  static fromEntity(entity: SourceEntity): SourceDto {
    const { id, title, link, image, description, enabled } = entity;
    return { id, title, link, image, description, enabled };
  }
}
