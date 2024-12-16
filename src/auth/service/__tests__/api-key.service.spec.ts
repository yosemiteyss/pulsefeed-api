import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiKey, CacheService } from '@pulsefeed/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyRepository } from '../../repository';
import { ApiKeyService } from '../api-key.service';
import { LoggerService } from '@nestjs/common';

describe('ApiKeyService', () => {
  let apiKeyService: ApiKeyService;
  let apiKeyRepository: DeepMockProxy<ApiKeyRepository>;
  let cacheService: DeepMockProxy<CacheService>;
  let loggerService: DeepMockProxy<LoggerService>;

  beforeEach(async () => {
    apiKeyRepository = mockDeep<ApiKeyRepository>();
    cacheService = mockDeep<CacheService>();
    loggerService = mockDeep<LoggerService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        {
          provide: ApiKeyRepository,
          useValue: apiKeyRepository,
        },
        {
          provide: CacheService,
          useValue: cacheService,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: loggerService,
        },
      ],
    }).compile();

    apiKeyService = module.get(ApiKeyService);
  });

  describe('getDefaultApiKey', () => {
    it('should get default api key from cache if exists', async () => {
      const apiKey = 'key';
      cacheService.get.mockResolvedValue(apiKey);
      const result = await apiKeyService.getDefaultApiKey();
      expect(result).toBe(apiKey);
      expect(apiKeyRepository.getAll).not.toHaveBeenCalled();
    });

    it('should get default api key from db if not exists in cache, and save to cache', async () => {
      const apiKey = 'key';
      cacheService.get.mockResolvedValue(undefined);
      apiKeyRepository.getAll.mockResolvedValue([{ key: apiKey }]);
      const result = await apiKeyService.getDefaultApiKey();
      expect(result).toBe(apiKey);
      expect(apiKeyRepository.getAll).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith('pf:api:api-key', apiKey);
    });
  });

  describe('createApiKey', () => {
    it('should remove api key, and save new api key to cache', async () => {
      const apiKey: ApiKey = { key: 'key' };
      apiKeyRepository.create.mockResolvedValue(apiKey);

      await apiKeyService.createApiKey();
      expect(cacheService.delete).toHaveBeenCalled();
      expect(apiKeyRepository.removeAll).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
      expect(apiKeyRepository.create).toHaveBeenCalled();
    });
  });

  describe('onModuleInit', () => {
    it('should create new api key, if no api key exists', async () => {
      const apiKey: ApiKey = { key: 'key' };
      cacheService.get.mockResolvedValue(undefined);
      apiKeyRepository.getAll.mockResolvedValue([]);
      apiKeyRepository.create.mockResolvedValue(apiKey);

      await apiKeyService.onModuleInit();
      expect(apiKeyRepository.create).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith('pf:api:api-key', apiKey.key);
    });

    it('should not create new api key, if api key exists', async () => {
      const apiKey: ApiKey = { key: 'key' };
      cacheService.get.mockResolvedValue(apiKey.key);
      apiKeyRepository.getAll.mockResolvedValue([apiKey]);

      await apiKeyService.onModuleInit();
      expect(apiKeyRepository.create).not.toHaveBeenCalled();
      expect(cacheService.set).not.toHaveBeenCalled();
    });
  });
});
