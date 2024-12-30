import { EnableLanguageRequest, LanguageListResponse, LanguageResponse } from '../dto';
import { CacheKeyBuilder, CacheService, LanguageRepository } from '@pulsefeed/common';
import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiResponseCacheKey } from '../../shared';

@Injectable()
export class LanguageService {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Get enabled languages list.
   * @returns cached language list response.
   */
  async getLanguageListResponse(): Promise<LanguageListResponse> {
    const action = async () => {
      const languages = await this.languageRepository.getEnabledLanguages(false);
      return languages.map((language) => LanguageResponse.fromModel(language));
    };
    const languages = await this.cacheService.wrap(
      CacheKeyBuilder.buildKeyWithSegments(ApiResponseCacheKey.LANGUAGE_LIST.prefix),
      action,
      ApiResponseCacheKey.LANGUAGE_LIST.ttl,
    );

    this.logger.log(`getLanguageListResponse, size: ${languages.length}`, LanguageService.name);
    return new LanguageListResponse(languages);
  }

  /**
   * Enable or disable language.
   * @param key the key of the language.
   * @param enabled true to enable language.
   */
  async setLanguageEnabled({ key, enabled }: EnableLanguageRequest) {
    const language = await this.languageRepository.getLanguage(key);
    if (!language) {
      throw new NotFoundException('Language is not found.');
    }
    await this.languageRepository.setLanguageEnabled(key, enabled);
    await this.cacheService.deleteByPrefix(ApiResponseCacheKey.LANGUAGE_LIST.prefix, true);
    this.logger.log(`setLanguageEnabled, key: ${key}, enabled: ${enabled}`, LanguageService.name);
  }
}
