import { DatabaseModule, CacheModule } from '@pulsefeed/common';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule],
})
export class AuthModule {}
