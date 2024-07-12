import { LanguageRepository } from './repository/language.repository';
import { LanguageMapper } from './repository/language.mapper';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepository, LanguageMapper],
  exports: [LanguageService],
})
export class LanguageModule {}
