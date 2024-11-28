import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiKeyRepository } from './api-key.repository';
import { CacheService } from '@pulsefeed/common';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async getDefaultKey(): Promise<string | undefined> {
    // Find in cache.
    const cachedKeys = await this.cacheService.getByPrefix<string>('pf:api-key');
    if (cachedKeys.length > 0) {
      return cachedKeys[0];
    }

    // Find in db.
    const dbKeys = await this.apiKeyRepository.getKeys();
    if (dbKeys.length > 0) {
      return dbKeys[0].key;
    }

    return undefined;
  }

  async pushKeysToCache() {
    const keys = await this.apiKeyRepository.getKeys();
    for (let i = 0; i < keys.length; i++) {
      await this.cacheService.setByKeyPrefix('pf:api-key', i, keys[i].key);
    }

    this.logger.log(`Pushed api keys to cache: ${keys.length}`, ApiKeyService.name);
  }

  async createKey(): Promise<string> {
    // Remove existing keys.
    await this.cacheService.delByPrefix('pf:api-key');
    await this.apiKeyRepository.removeKeys();

    const apiKey = this.generateApiKey();
    const entity = await this.apiKeyRepository.createKey({ key: apiKey });

    // Save key to cache.
    await this.cacheService.setByKeyPrefix('pf:api-key', 0, entity.key);

    this.logger.log(`Created new api key: ${entity.key}`, ApiKeyService.name);

    return entity.key;
  }

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
