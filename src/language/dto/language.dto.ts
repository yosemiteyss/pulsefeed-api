import { Language } from '@common/model';

export class LanguageDto {
  readonly key: string;

  static fromModel(model: Language): LanguageDto {
    return { key: model.key };
  }
}
