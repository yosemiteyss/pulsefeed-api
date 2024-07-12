import { Source as SourceEntity } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Source } from '@common/model';

@Injectable()
export class SourceMapper {
  sourceEntityToModel(entity: SourceEntity): Source {
    return {
      id: entity.id,
      title: entity.title,
      link: entity.link,
      image: entity.image ?? undefined,
      description: entity.description ?? undefined,
      languages: [],
    };
  }
}
