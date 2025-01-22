import { LanguageRepository } from '@pulsefeed/common';
import { LanguageController } from './controller';
import { LanguageService } from './service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepository],
  exports: [LanguageService],
})
export class LanguageModule {}
