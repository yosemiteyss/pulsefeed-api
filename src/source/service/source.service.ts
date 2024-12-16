import {
  CacheService,
  ONE_DAY_IN_MS,
  PageRequest,
  PageResponse,
  SourceRepository,
} from '@pulsefeed/common';
import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { DEFAULT_PAGE_SIZE, ResponseCacheKeys } from '../../shared';
import { EnableSourceRequest, SourceResponse } from '../dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SourceService {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  /**
   * Get page response of enabled sources.
   * @param page the page number.
   * @returns the cached page response of sources.
   */
  async getSourcePageResponse({ page }: PageRequest): Promise<PageResponse<SourceResponse>> {
    const limit = DEFAULT_PAGE_SIZE;
    const cacheKey = ResponseCacheKeys.SOURCE_PAGE.replace('{page}', `${page}`).replace(
      '{limit}',
      `${limit}`,
    );
    const action = async () => {
      const [sources, total] = await this.sourceRepository.getEnabledSourcesPaginated(
        page,
        limit,
        false,
      );
      const response = sources.map((source) => SourceResponse.fromModel(source));
      return new PageResponse<SourceResponse>(response, total, page, limit);
    };

    const pageResponse = await this.cacheService.wrap(cacheKey, action, ONE_DAY_IN_MS);
    this.logger.log(
      `getEnabledSourcesPageResponse, page: ${page}, size: ${pageResponse.data.length}`,
    );
    return pageResponse;
  }

  /**
   * Enable or disable source.
   * @param request enable source request.
   */
  async setSourceEnabled(request: EnableSourceRequest) {
    const source = await this.sourceRepository.getSource(request.id);
    if (!source) {
      throw new NotFoundException('Source is not found.');
    }
    await this.sourceRepository.setSourceEnabled(source.id, request.enabled);
    await this.cacheService.deleteByPrefix(ResponseCacheKeys.SOURCE_LIST, true);
  }
}
