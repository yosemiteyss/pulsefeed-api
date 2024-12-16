import { LanguageResponse } from './language.response';

export class LanguageListResponse {
  constructor(languages: LanguageResponse[]) {
    this.languages = languages;
  }

  /**
   * List of languages.
   */
  readonly languages: LanguageResponse[];
}
