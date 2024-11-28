import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { SourceRepository } from './repository/source.repository';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Source } from '@pulsefeed/common';

@Injectable()
export class SourceService {
  constructor(
    private readonly sourceRepository: SourceRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
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
