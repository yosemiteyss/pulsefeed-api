import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@common/logger';
import { CacheService } from '@common/cache';
import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from '@common/db';
import { Repository } from 'typeorm';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  private readonly apiKeyCachePrefix = 'pf:api-key';

  async getDefaultKey(): Promise<string | undefined> {
    // Find in cache.
    const cachedKeys = await this.cacheService.getByPrefix<string>(this.apiKeyCachePrefix);
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
      await this.cacheService.setByKeyPrefix(this.apiKeyCachePrefix, i, keys[i].key);
    }

    this.logger.log(ApiKeyService.name, `Pushed api keys to cache: ${keys.length}`);
  }

  async createKey(): Promise<string> {
    // Delete api key first.
    await this.apiKeyRepository.clear();
    await this.cacheService.delByPrefix(this.apiKeyCachePrefix);

    const key = this.generateApiKey();
    const apiKey = await this.apiKeyRepository.save({ key });

    await this.cacheService.setByKeyPrefix(this.apiKeyCachePrefix, 0, apiKey.key);

    this.logger.log(ApiKeyService.name, `Created new api key: ${apiKey.key}`);

    return apiKey.key;
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
