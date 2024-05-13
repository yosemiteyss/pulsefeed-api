import { Injectable, NotFoundException } from '@nestjs/common';
import { EnableSourceDto } from '../dto/enable-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceDto } from '../dto/source.dto';
import { SourceEntity } from '@common/db';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity) private readonly sourceRepository: Repository<SourceEntity>,
  ) {}

  async getSourceList(): Promise<SourceDto[]> {
    const sourceList = await this.sourceRepository.find({
      order: { title: 'ASC' },
    });

    return sourceList.map((source) => SourceDto.fromEntity(source));
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
