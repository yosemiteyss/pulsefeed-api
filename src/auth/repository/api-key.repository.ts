import { PrismaService, ApiKey } from '@pulsefeed/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get API keys.
   * @returns array of api keys.
   */
  async getAll(): Promise<ApiKey[]> {
    const result = await this.prismaService.apiKey.findMany();
    return result.map((apikey) => ({
      key: apikey.key,
    }));
  }

  /**
   * Create a new API key.
   * @param apiKey the new created key.
   */
  async create(apiKey: ApiKey): Promise<ApiKey> {
    const result = await this.prismaService.apiKey.create({
      data: {
        key: apiKey.key,
      },
    });
    return { key: result.key };
  }

  /**
   * Remove all API keys.
   */
  async removeAll() {
    await this.prismaService.apiKey.deleteMany();
  }
}
