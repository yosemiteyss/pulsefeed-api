import { DatabaseModule, CacheModule } from '@pulsefeed/common';
import { Global, Module } from '@nestjs/common';
import { ApiKeyRepository } from './repository';
import { ApiKeyService } from './service';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [ApiKeyService, ApiKeyRepository],
  exports: [ApiKeyService],
})
export class AuthModule {}
