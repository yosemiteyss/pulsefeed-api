import { LanguageController } from './controller/language.controller';
import { LanguageRepository } from './repository/language.repository';
import { LanguageService } from './service/language.service';
import { DatabaseModule } from '@common/db';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepository],
  exports: [LanguageService],
})
export class LanguageModule {}
