import { SourceMapper } from './source.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/db';
import { Source } from '@common/model';

@Injectable()
export class SourceRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sourceMapper: SourceMapper,
  ) {}

  async getSourceById(id: string): Promise<Source | undefined> {
    const result = await this.prismaService.source.findFirst({
      where: {
        id: id,
      },
    });

    if (!result) {
      return undefined;
    }

    return this.sourceMapper.sourceEntityToModel(result);
  }

  async getEnabledSources(page: number, limit: number): Promise<[Source[], number]> {
    const [sources, total] = await this.prismaService.source.findManyAndCount({
      where: {
        enabled: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const models = sources.map((source) => this.sourceMapper.sourceEntityToModel(source));
    return [models, total];
  }

  async setSourceEnabled(id: string, enabled: boolean) {
    await this.prismaService.source.update({
      where: {
        id: id,
      },
      data: {
        enabled: enabled,
      },
    });
  }
}
