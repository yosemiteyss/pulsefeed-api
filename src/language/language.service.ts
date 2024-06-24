import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableLanguageDto } from './dto/enable-language.dto';
import { LanguageRepository } from './language.repository';
import { LanguageDto } from './dto/language.dto';
import { LoggerService } from '@common/logger';

@Injectable()
export class LanguageService {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedLanguages(): Promise<LanguageDto[]> {
    const languages = await this.languageRepository.findEnabled();
    return languages.map((entity) => ({ key: entity.key }));
  }

  async setLanguageEnabled(request: EnableLanguageDto) {
    const { key, enabled } = request;
    const language = await this.languageRepository.find(key);

    if (!language) {
      this.logger.warn(LanguageService.name, `language: ${key} is not found`);
      throw new NotFoundException();
    }

    language.enabled = enabled;

    await this.languageRepository.save(language);
  }
}
