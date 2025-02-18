import { RepositoryModule } from '@pulsefeed/common';
import { LanguageController } from './controller';
import { LanguageService } from './service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RepositoryModule],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
