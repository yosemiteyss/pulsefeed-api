import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/db';
import { ApiKey } from '@common/model';

@Injectable()
export class ApiKeyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getKeys(): Promise<ApiKey[]> {
    const result = await this.prismaService.apiKey.findMany();
    return result.map((apikey) => ({
      key: apikey.key,
    }));
  }

  async removeKeys() {
    await this.prismaService.apiKey.deleteMany();
  }

  async createKey(apiKey: ApiKey): Promise<ApiKey> {
    const result = await this.prismaService.apiKey.create({
      data: {
        key: apiKey.key,
      },
    });

    return { key: result.key };
  }
}
