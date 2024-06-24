import { LanguageController } from './language.controller';
import { LanguageRepository } from './language.repository';
import { LanguageService } from './language.service';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepository],
  exports: [LanguageService],
})
export class LanguageModule {}
