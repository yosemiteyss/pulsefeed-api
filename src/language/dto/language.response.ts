import { Language } from '@pulsefeed/common';

export class LanguageResponse {
  constructor(key: string) {
    this.key = key;
  }

  readonly key: string;

  static fromModel(model: Language): LanguageResponse {
    return { key: model.key };
  }
}
