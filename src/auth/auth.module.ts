import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ApiKeyService } from './service/api-key.service';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async onModuleInit() {
    await this.apiKeyService.pushKeysToCache();
  }
}
