import { SourceRepository } from './repository/source.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableSourceDto } from './dto/enable-source.dto';
import { DEFAULT_PAGE_SIZE } from 'src/shared/constants';
import { PageRequest, PageResponse } from '@common/dto';
import { LoggerService } from '@common/logger';
import { SourceDto } from './dto/source.dto';
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

  async getSupportedSources(request: PageRequest): Promise<PageResponse<SourceDto>> {
    const { page } = request;
    const limit = DEFAULT_PAGE_SIZE;

    const [data, total] = await this.sourceRepository.getEnabledSources(page, limit);

    const sources = data.map((source) => SourceDto.fromModel(source));
    this.logger.log(SourceService.name, `getEnabledSourceList: ${sources.length}`);

    return new PageResponse<SourceDto>(data, total, page, limit);
  }

  async setSourceEnabled(request: EnableSourceDto) {
    const { id, enabled } = request;

    const source = await this.getSourceById(id);

    await this.sourceRepository.setSourceEnabled(source.id, enabled);
  }
}
