import { PrismaService, Language } from '@pulsefeed/common';
import { LanguageMapper } from './language.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly languageMapper: LanguageMapper,
  ) {}

  async getLanguageByKey(key: string): Promise<Language | undefined> {
    const result = await this.prismaService.language.findFirst({
      where: {
        key: key,
      },
    });

    if (!result) {
      return undefined;
    }

    return this.languageMapper.langEntityToModel(result);
  }

  async getEnabledLanguages(): Promise<Language[]> {
    const result = await this.prismaService.language.findMany({
      where: {
        enabled: true,
      },
    });

    return result.map((language) => this.languageMapper.langEntityToModel(language));
  }

  async setLanguageEnabled(key: string, enabled: boolean) {
    await this.prismaService.language.update({
      where: { key: key },
      data: {
        enabled: enabled,
      },
    });
  }
}
