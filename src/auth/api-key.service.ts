import { ApiKeyRepository } from '../repository/api-key.repository';
import { LoggerService } from '@common/logger';
import { CacheService } from '@common/cache';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  private readonly CACHE_PREFIX = 'pf:api-key';

  async getDefaultKey(): Promise<string | undefined> {
    // Find in cache.
    const cachedKeys = await this.cacheService.getByPrefix<string>(this.CACHE_PREFIX);
    if (cachedKeys.length > 0) {
      return cachedKeys[0];
    }

    // Find in db.
    const dbKeys = await this.apiKeyRepository.find();
    if (dbKeys.length > 0) {
      return cachedKeys[0];
    }

    return undefined;
  }

  async pushKeysToCache() {
    const keys = await this.apiKeyRepository.find();
    for (let i = 0; i < keys.length; i++) {
      await this.cacheService.setByKeyPrefix(this.CACHE_PREFIX, i, keys[i].key);
    }

    this.logger.log(ApiKeyService.name, `Pushed api keys to cache: ${keys.length}`);
  }

  async createKey(): Promise<string> {
    // Remove existing keys.
    await this.cacheService.delByPrefix(this.CACHE_PREFIX);
    await this.apiKeyRepository.clear();

    const apiKey = this.generateApiKey();
    const entity = await this.apiKeyRepository.save({ key: apiKey });

    // Save key to cache.
    await this.cacheService.setByKeyPrefix(this.CACHE_PREFIX, 0, entity.key);

    this.logger.log(ApiKeyService.name, `Created new api key: ${entity.key}`);

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
