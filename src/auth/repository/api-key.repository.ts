import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from '@common/db';
import { ApiKey } from '@common/model';
import { Repository } from 'typeorm';

@Injectable()
export class ApiKeyRepository {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
  ) {}

  async find(): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.find();
  }

  async clear() {
    return this.apiKeyRepository.clear();
  }

  async save(apiKey: ApiKey): Promise<ApiKeyEntity> {
    return this.apiKeyRepository.save(apiKey);
  }
}
