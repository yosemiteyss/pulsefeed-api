import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@common/logger';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@common/cache';
import { ApiKeyEntity } from '@common/db';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  private readonly apiKeyCachePrefix = 'pf:api-key';

  async onModuleInit(): Promise<void> {
    // Push all keys to cache.
    const keys = await this.apiKeyRepository.find();
    for (let i = 0; i < keys.length; i++) {
      await this.cacheService.setByKeyPrefix(this.apiKeyCachePrefix, i, keys[i].key);
    }

    this.logger.log(AuthService.name, `Pushed api keys to cache: ${keys.length}`);
  }

  isAdminValid(key: string): boolean {
    return key === this.configService.get<string>('ADMIN_SECRET_KEY');
  }

  async createApiKey(): Promise<string> {
    // Delete api key first.
    await this.apiKeyRepository.clear();
    await this.cacheService.delByPrefix(this.apiKeyCachePrefix);

    const key = this.generateApiKey();
    const apiKey = await this.apiKeyRepository.save({ key });

    await this.cacheService.setByKeyPrefix(this.apiKeyCachePrefix, 0, apiKey.key);

    this.logger.log(AuthService.name, `Created new api key: ${apiKey.key}`);

    return apiKey.key;
  }

  async isApiKeyValid(key?: string): Promise<boolean> {
    if (!key) {
      return false;
    }

    // Find by cache.
    const keys = await this.cacheService.getByPrefix<string>(this.apiKeyCachePrefix);
    if (keys.includes(key)) {
      return true;
    }

    // Find by db.
    const keyInDb = await this.apiKeyRepository.exists({ where: { key } });
    if (!keyInDb) {
      throw new UnauthorizedException('Invalid key');
    }

    return true;
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
