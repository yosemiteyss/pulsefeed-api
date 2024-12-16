import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CacheService } from '@pulsefeed/common';
import { ApiKeyRepository } from '../repository';
import { ApiKeyResponse } from '../dto';

@Injectable()
export class ApiKeyService implements OnModuleInit {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  private readonly CACHE_KEY_API_KEY = 'pf:api:api-key';

  /**
   * Push api keys to cache on module init.
   * If no api key is found, create a new one.
   */
  async onModuleInit() {
    const apiKey = await this.getDefaultApiKey();
    if (!apiKey) {
      this.logger.warn('No api key is found, start create new one.', ApiKeyService.name);
      await this.createApiKey();
    } else {
      this.logger.warn(`Api key: ${apiKey}`, ApiKeyService.name);
    }
  }

  /**
   * Get default API key.
   * @returns the default API key, or undefined if not found.
   */
  async getDefaultApiKey(): Promise<string | undefined> {
    // Get from cache.
    const cachedKey = await this.cacheService.get<string>(this.CACHE_KEY_API_KEY);
    if (cachedKey) {
      return cachedKey;
    }

    // Get from db.
    const storedKeys = await this.apiKeyRepository.getAll();
    if (storedKeys.length > 0) {
      const defaultKey = storedKeys[0];
      await this.cacheService.set(this.CACHE_KEY_API_KEY, defaultKey.key);
      return defaultKey.key;
    }

    return undefined;
  }

  /**
   * Generate a new API key and save to db.
   * @returns api key response.
   */
  async createApiKey(): Promise<ApiKeyResponse> {
    // Remove existing keys.
    await this.cacheService.delete(this.CACHE_KEY_API_KEY);
    await this.apiKeyRepository.removeAll();
    this.logger.log('Removed all api keys.', ApiKeyService.name);

    // Create new key and save to cache.
    const apiKey = this.generateApiKey();
    const storedKey = await this.apiKeyRepository.create({ key: apiKey });
    await this.cacheService.set(this.CACHE_KEY_API_KEY, storedKey.key);
    this.logger.log(`Created new api key: ${storedKey.key}`, ApiKeyService.name);

    return { key: apiKey };
  }

  /**
   * Generate api key with the given length.
   * @param length the key length.
   * @returns api key
   * @private
   */
  private generateApiKey(length: number = 64): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      apiKey += charset[randomIndex];
    }

    return apiKey;
  }
}
