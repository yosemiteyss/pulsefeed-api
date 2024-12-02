import { Language } from '@pulsefeed/common';

export class LanguageDto {
  constructor(key: string) {
    this.key = key;
  }

  /**
   * The key of the language.
   */
  readonly key: string;

  /**
   * Convert language model to dto.
   * @param model language model
   */
  static fromModel(model: Language): LanguageDto {
    return { key: model.key };
  }
}
