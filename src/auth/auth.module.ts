import { AuthService } from './service/auth.service';
import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@common/cache';
import { DatabaseModule } from '@common/db';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
