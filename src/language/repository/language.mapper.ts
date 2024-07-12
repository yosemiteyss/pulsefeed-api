import { Prisma, Language as LanguageEntity } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Language } from '@common/model';

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
