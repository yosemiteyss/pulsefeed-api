import { Prisma, Language as LanguageEntity } from '@prisma/client';
import { Language } from '@pulsefeed/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageMapper {
  langEntityToModel(entity: LanguageEntity): Language {
    return {
      key: entity.key,
    };
  }

  langModelToCreateInput(model: Language): Prisma.LanguageCreateInput {
    return {
      key: model.key,
    };
  }
}
