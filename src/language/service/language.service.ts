import { EnableLanguageDto } from '../dto/enable-language.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageDto } from '../dto/language.dto';
import { LoggerService } from '@common/logger';
import { LanguageEntity } from '@common/db';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedLanguages(): Promise<LanguageDto[]> {
    const languages = await this.languageRepository.find({ where: { enabled: true } });
    return languages.map((entity) => ({ key: entity.key }));
  }

  async setLanguageEnabled(request: EnableLanguageDto) {
    const { key, enabled } = request;
    const language = await this.languageRepository.findOneBy({ key });

    if (!language) {
      this.logger.warn(LanguageService.name, `language: ${key} is not found`);
      throw new NotFoundException();
    }

    language.enabled = enabled;

    await this.languageRepository.save(language);
  }
}
