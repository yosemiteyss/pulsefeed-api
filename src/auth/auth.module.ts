import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
