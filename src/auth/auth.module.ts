import { Global, Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [AuthService, Logger],
  exports: [AuthService],
})
export class AuthModule {}
