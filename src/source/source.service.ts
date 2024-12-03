import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CacheService, Source } from '@pulsefeed/common';
import { cacheKeySourceList } from './cache.constants';
import { SourceRepository } from './repository';
import { DEFAULT_TTL } from '../shared';

@Injectable()
export class SourceService {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Returns supported article sources.
   * Get data from cache or load from db if cache missed.
   *
   * @param page page number
   * @param limit no of item in a page
   * @returns sources items and the total number of sources
   */
  async getSupportedSources(page: number, limit: number): Promise<[Source[], number]> {
    return this.cacheService.wrap(
      cacheKeySourceList(page, limit),
      () => this.sourceRepository.getEnabledSources(page, limit),
      DEFAULT_TTL,
    );
  }

  /**
   * Returns the source by id.
   * @param id the id of the source.
   */
  async getSourceById(id: string): Promise<Source> {
    const source = await this.sourceRepository.getSourceById(id);

    if (!source) {
      this.logger.error(`source not found: ${id}`, SourceService.name);
      throw new NotFoundException();
    }

    return source;
  }

  /**
   * Enable or disable source.
   * @param id the id of the source.
   * @param enabled true to enable language.
   */
  async setSourceEnabled(id: string, enabled: boolean) {
    const source = await this.getSourceById(id);
    await this.sourceRepository.setSourceEnabled(source.id, enabled);
  }
}
