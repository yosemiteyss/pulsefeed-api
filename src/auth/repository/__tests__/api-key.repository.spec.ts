import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ApiKey, PrismaService } from '@pulsefeed/common';
import { ApiKeyRepository } from '../api-key.repository';
import { ApiKey as ApiKeyEntity } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

describe('ApiKeyRepository', () => {
  let apiKeyRepository: ApiKeyRepository;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaService = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyRepository,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    apiKeyRepository = module.get(ApiKeyRepository);
  });

  describe('getAll', () => {
    it('should return all api keys', async () => {
      const entities: ApiKeyEntity[] = [
        {
          key: '123asdf',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      prismaService.apiKey.findMany.mockResolvedValue(entities);
      const result = await apiKeyRepository.getAll();
      const expected: ApiKey[] = [{ key: entities[0].key }];
      expect(result).toEqual(expected);
      expect(prismaService.apiKey.findMany).toHaveBeenCalledWith();
    });
  });

  describe('create', () => {
    it('should create new api key', async () => {
      const apiKey: ApiKey = { key: '123asdf' };
      const entity: ApiKeyEntity = {
        key: apiKey.key,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      prismaService.apiKey.create.mockResolvedValue(entity);
      const result = await apiKeyRepository.create(apiKey);
      expect(prismaService.apiKey.create).toHaveBeenCalledWith({ data: apiKey });
      expect(result).toEqual(apiKey);
    });
  });

  describe('removeAll', () => {
    it('should remove all api keys', async () => {
      await apiKeyRepository.removeAll();
      expect(prismaService.apiKey.deleteMany).toHaveBeenCalledWith();
    });
  });
});
