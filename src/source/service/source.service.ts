import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableSourceDto } from '../dto/enable-source.dto';
import { DEFAULT_PAGE_SIZE } from '../../constant/constants';
import { PageRequest, PageResponse } from '@common/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@common/logger';
import { SourceDto } from '../dto/source.dto';
import { SourceEntity } from '@common/db';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity) private readonly sourceRepository: Repository<SourceEntity>,
    private readonly logger: LoggerService,
  ) {}

  async getSupportedSources(request: PageRequest): Promise<PageResponse<SourceDto>> {
    const { page } = request;
    const limit = DEFAULT_PAGE_SIZE;

    const [data, total] = await this.sourceRepository.findAndCount({
      where: {
        enabled: true,
      },
      order: { title: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const sources = data.map((source) => SourceDto.fromEntity(source));
    this.logger.log(SourceService.name, `getEnabledSourceList: ${sources.length}`);

    return { data: sources, total, page, limit };
  }

  async setSourceEnabled(request: EnableSourceDto) {
    const { sourceId, enabled } = request;
    const source = await this.sourceRepository.findOneBy({ id: sourceId });

    if (!source) {
      this.logger.warn(SourceService.name, `source: ${sourceId} is not found`);
      throw new NotFoundException();
    }

    source.enabled = enabled;

    await this.sourceRepository.save(source);
  }
}
