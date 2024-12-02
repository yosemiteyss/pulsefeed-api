import { Inject, Injectable, LoggerService, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CacheService, Language, LanguageEnum } from '@pulsefeed/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CACHE_KEY_LANG_LIST } from './cache.constants';
import { LanguageRepository } from './repository';
import { stringToEnum } from '@pulsefeed/common';
import { DEFAULT_TTL } from '../shared';

@Injectable()
export class LanguageService implements OnModuleInit {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Save language list to cache on module init.
   */
  async onModuleInit() {
    await this.getSupportedLanguages();
    this.logger.log('Saved supported languages to cache', LanguageService.name);
  }

  /**
   * Get supported language list, and save to cache.
   */
  async getSupportedLanguages(): Promise<Language[]> {
    return this.cacheService.wrap(
      CACHE_KEY_LANG_LIST,
      () => this.languageRepository.getEnabledLanguages(),
      DEFAULT_TTL,
    );
  }

  /**
   * Enable or disable language.
   * @param key the key of the language.
   * @param enabled true to enable language.
   */
  async setLanguageEnabled(key: string, enabled: boolean) {
    const language = await this.languageRepository.getLanguageByKey(key);

    if (!language) {
      this.logger.warn(`language not found: ${key}`, LanguageService.name);
      throw new NotFoundException();
    }

    await this.languageRepository.setLanguageEnabled(language.key, enabled);
  }

  /**
   * Check if the given language is supported.
   * @param key the key of the language.
   */
  isSupportedLanguage(key: string): boolean {
    return stringToEnum(LanguageEnum, key) !== undefined;
  }
}
