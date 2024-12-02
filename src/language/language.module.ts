import { LanguageRepository, LanguageMapper } from './repository';
import { CacheModule, DatabaseModule } from '@pulsefeed/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepository, LanguageMapper],
  exports: [LanguageService],
})
export class LanguageModule {}
