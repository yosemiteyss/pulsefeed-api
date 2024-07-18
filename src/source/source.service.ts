import { SourceRepository } from './repository/source.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from '@common/logger';
import { Source } from '@common/model';

@Injectable()
export class SourceService {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly logger: LoggerService,
  ) {}

  async getSourceById(id: string): Promise<Source> {
    const source = await this.sourceRepository.getSourceById(id);

    if (!source) {
      this.logger.warn(SourceService.name, `source not found: ${id}`);
      throw new NotFoundException();
    }

    return source;
  }

  /**
   * Returns supported article sources.
   * @param page
   * @param limit
   * @returns sources in the given page and total number of sources
   */
  async getSupportedSources(page: number, limit: number): Promise<[Source[], number]> {
    const [data, total] = await this.sourceRepository.getEnabledSources(page, limit);
    return [data, total];
  }

  async setSourceEnabled(id: string, enabled: boolean) {
    const source = await this.getSourceById(id);
    await this.sourceRepository.setSourceEnabled(source.id, enabled);
  }
}
