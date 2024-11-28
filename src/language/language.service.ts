import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { LanguageRepository } from './repository/language.repository';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Language, LanguageEnum } from '@pulsefeed/common';
import { stringToEnum } from '@pulsefeed/common';

@Injectable()
export class LanguageService {
  constructor(
    private readonly languageRepository: LanguageRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async getSupportedLanguages(): Promise<Language[]> {
    return await this.languageRepository.getEnabledLanguages();
  }

  async setLanguageEnabled(key: string, enabled: boolean) {
    const language = await this.languageRepository.getLanguageByKey(key);

    if (!language) {
      this.logger.warn(`language not found: ${key}`, LanguageService.name);
      throw new NotFoundException();
    }

    await this.languageRepository.setLanguageEnabled(language.key, enabled);
  }

  isSupportedLanguage(key: string): boolean {
    return stringToEnum(LanguageEnum, key) !== undefined;
  }
}
