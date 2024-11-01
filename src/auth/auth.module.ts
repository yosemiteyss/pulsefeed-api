import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ApiKeyRepository } from './api-key.repository';
import { DatabaseModule } from '@pulsefeed/common';
import { ApiKeyService } from './api-key.service';
import { CacheModule } from '@pulsefeed/common';

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
