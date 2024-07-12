import { LanguageRepository } from './repository/language.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableLanguageDto } from './dto/enable-language.dto';
import { LanguageDto } from './dto/language.dto';
import { LoggerService } from '@common/logger';
import { stringToEnum } from '@common/utils';
import { LanguageEnum } from '@common/model';

@Injectable()
export class LanguageService {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedLanguages(): Promise<LanguageDto[]> {
    const languages = await this.languageRepository.getEnabledLanguages();
    return languages.map((language) => ({ key: language.key }));
  }

  async setLanguageEnabled(request: EnableLanguageDto) {
    const { key, enabled } = request;
    const language = await this.languageRepository.getLanguageByKey(key);

    if (!language) {
      this.logger.warn(LanguageService.name, `language not found: ${key}`);
      throw new NotFoundException();
    }

    await this.languageRepository.setLanguageEnabled(language.key, enabled);
  }

  isSupportedLanguage(language: string): boolean {
    return stringToEnum(LanguageEnum, language) !== undefined;
  }
}
