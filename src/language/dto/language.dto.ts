import { Language } from '@pulsefeed/common';

export class LanguageDto {
  readonly key: string;

  static fromModel(model: Language): LanguageDto {
    return { key: model.key };
  }
}
