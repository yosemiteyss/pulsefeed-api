import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { LanguageEntity } from '@common/db';
import { Language } from '@common/model';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageRepository {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  async find(key: string): Promise<LanguageEntity> {
    return this.languageRepository.findOneBy({ key });
  }

  async findEnabled(): Promise<LanguageEntity[]> {
    return this.languageRepository.find({ where: { enabled: true } });
  }

  async save(language: Language): Promise<LanguageEntity> {
    return this.languageRepository.save(language);
  }
}
