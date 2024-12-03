import { Inject, Injectable, LoggerService, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CacheService, Language, LanguageEnum, stringToEnum } from '@pulsefeed/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CACHE_KEY_LANG_LIST } from './cache.constants';
import { LanguageRepository } from './repository';
import { ONE_DAY_IN_MS } from '../shared';

@Injectable()
export class LanguageService implements OnModuleInit {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Load language list to cache on module init.
   */
  async onModuleInit() {
    await this.getSupportedLanguages();
    this.logger.log('Saved supported languages to cache', LanguageService.name);
  }

  /**
   * Return supported language list, and save to cache.
   * Get data from cache or load from db if cache missed.
   */
  async getSupportedLanguages(): Promise<Language[]> {
    return this.cacheService.wrap(
      CACHE_KEY_LANG_LIST,
      () => this.languageRepository.getEnabledLanguages(),
      ONE_DAY_IN_MS,
    );
  }

  /**
   * Returns the language by key.
   * @param key the key of the language.
   */
  async getLanguageByKey(key: string): Promise<Language> {
    const language = await this.languageRepository.getLanguageByKey(key);

    if (!language) {
      this.logger.error(`language not found: ${key}`, LanguageService.name);
      throw new NotFoundException();
    }

    return language;
  }

  /**
   * Enable or disable language.
   * @param key the key of the language.
   * @param enabled true to enable language.
   */
  async setLanguageEnabled(key: string, enabled: boolean) {
    const language = await this.getLanguageByKey(key);
    await this.languageRepository.setLanguageEnabled(language.key, enabled);
    await this.cacheService.delete(CACHE_KEY_LANG_LIST);
  }

  /**
   * Check if the given language is supported.
   * @param key the key of the language.
   */
  isSupportedLanguage(key: string): boolean {
    return stringToEnum(LanguageEnum, key) !== undefined;
  }
}
