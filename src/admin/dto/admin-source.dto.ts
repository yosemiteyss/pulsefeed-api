import { SourceDto } from '../../source/dto/source.dto';
import { SourceEntity } from '@common/db';

export class AdminSourceDto extends SourceDto {
  readonly enabled?: boolean;

  static override fromEntity(entity: SourceEntity): AdminSourceDto {
    const { id, title, link, image, description, enabled } = entity;
    return { id, title, link, image, description, enabled };
  }
}
