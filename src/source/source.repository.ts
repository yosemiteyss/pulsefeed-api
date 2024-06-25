import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { SourceEntity } from '@common/db';
import { Source } from '@common/model';
import { Repository } from 'typeorm';

@Injectable()
export class SourceRepository {
  constructor(
    @InjectRepository(SourceEntity) private readonly sourceRepository: Repository<SourceEntity>,
  ) {}

  async find(id: string): Promise<SourceEntity> {
    return this.sourceRepository.findOneBy({ id });
  }

  async findEnabled(page: number, limit: number): Promise<[SourceEntity[], number]> {
    return this.sourceRepository.findAndCount({
      where: {
        enabled: true,
      },
      order: { title: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async save(source: Source): Promise<SourceEntity> {
    return this.sourceRepository.save(source);
  }
}
