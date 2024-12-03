import { DatabaseModule, CacheModule } from '@pulsefeed/common';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ApiKeyRepository } from './api-key.repository';
import { ApiKeyService } from './api-key.service';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [ApiKeyService, ApiKeyRepository],
  exports: [ApiKeyService],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async onModuleInit() {
    await this.apiKeyService.pushKeysToCache();
  }
}
