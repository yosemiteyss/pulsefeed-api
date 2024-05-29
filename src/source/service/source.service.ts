import { EnableSourceDto } from '../../admin/dto/enable-source.dto';
import { AdminSourceDto } from '../../admin/dto/admin-source.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PageRequest, PageResponse } from '@common/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceDto } from '../dto/source.dto';
import { SourceEntity } from '@common/db';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity) private readonly sourceRepository: Repository<SourceEntity>,
  ) {}

  async getEnabledSourceList(request: PageRequest): Promise<PageResponse<SourceDto>> {
    const { page } = request;
    const limit = 10;

    let [data, total] = await this.sourceRepository.findAndCount({
      where: {
        enabled: true,
      },
      order: { title: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    data = data.map((source) => SourceDto.fromEntity(source));

    return { data, total, page, limit };
  }

  async getAdminSourceList(): Promise<AdminSourceDto[]> {
    const sources = await this.sourceRepository.find({
      order: { title: 'ASC' },
    });

    return sources.map((source) => AdminSourceDto.fromEntity(source));
  }

  async setSourceEnabled(request: EnableSourceDto): Promise<SourceDto> {
    const { sourceId, enabled } = request;
    const source = await this.sourceRepository.findOneBy({ id: sourceId });

    if (!source) {
      throw new NotFoundException(`source: ${sourceId} not found`);
    }

    source.enabled = enabled;

    const result = await this.sourceRepository.save(source);
    return SourceDto.fromEntity(result);
  }
}
