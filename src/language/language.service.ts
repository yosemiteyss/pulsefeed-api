import { LanguageRepository } from './repository/language.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Language, LanguageEnum } from '@pulsefeed/common';
import { LoggerService } from '@pulsefeed/common';
import { stringToEnum } from '@pulsefeed/common';

@Injectable()
export class LanguageService {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedLanguages(): Promise<Language[]> {
    return await this.languageRepository.getEnabledLanguages();
  }

  async setLanguageEnabled(key: string, enabled: boolean) {
    const language = await this.languageRepository.getLanguageByKey(key);

    if (!language) {
      this.logger.warn(LanguageService.name, `language not found: ${key}`);
      throw new NotFoundException();
    }

    await this.languageRepository.setLanguageEnabled(language.key, enabled);
  }

  isSupportedLanguage(key: string): boolean {
    return stringToEnum(LanguageEnum, key) !== undefined;
  }
}
