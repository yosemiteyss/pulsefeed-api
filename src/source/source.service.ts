import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { CACHE_KEY_SOURCE_LIST, cacheKeySourceList } from './cache.constants';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CacheService, Source } from '@pulsefeed/common';
import { SourceRepository } from './repository';
import { CACHE_KEY_ARTICLE } from '../article';
import { ONE_DAY_IN_MS } from '../shared';

@Injectable()
export class SourceService {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Returns supported article sources by page.
   * Get data from cache or load from db if cache missed.
   * @param page page number
   * @param limit no of item in a page
   * @returns sources items and the total number of sources
   */
  async getSupportedSources(page: number, limit: number): Promise<[Source[], number]> {
    return this.cacheService.wrap(
      cacheKeySourceList(page, limit),
      () => this.sourceRepository.getEnabledSources(page, limit),
      ONE_DAY_IN_MS,
    );
  }

  /**
   * Returns all supported article sources.
   * Get data from cache or load from db if cache missed.
   * @returns sources items
   */
  async getAllSupportedSources(): Promise<Source[]> {
    return this.cacheService.wrap(
      CACHE_KEY_SOURCE_LIST,
      () => this.sourceRepository.getAllEnabledSources(),
      ONE_DAY_IN_MS,
    );
  }

  /**
   * Returns the source by id.
   * @param id the id of the source.
   */
  async getSourceById(id: string): Promise<Source> {
    const sources = await this.getAllSupportedSources();
    const source = sources.find((source) => source.id === id);

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

    await this.cacheService.delByPrefix(CACHE_KEY_SOURCE_LIST);
    await this.cacheService.delByPrefix(CACHE_KEY_ARTICLE);
  }
}
