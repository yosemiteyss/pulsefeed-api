import { mockLoggerService } from '../../shared/__tests__/logger.service.mock';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiKeyRepository } from '../api-key.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from '../api-key.service';
import { CacheService } from '@pulsefeed/common';

describe('ApiKeyService', () => {
  let apiKeyService: ApiKeyService;
  let apiKeyRepository: jest.Mocked<ApiKeyRepository>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        {
          provide: ApiKeyRepository,
          useValue: {
            getKeys: jest.fn(),
            removeKeys: jest.fn(),
            createKey: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getByPrefix: jest.fn(),
            setByKeyPrefix: jest.fn(),
            delByPrefix: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    apiKeyService = module.get<ApiKeyService>(ApiKeyService);
    apiKeyRepository = module.get(ApiKeyRepository);
    cacheService = module.get(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDefaultKey', () => {
    it('should return the key from cache if it exists', async () => {
      const mockKey = 'mock-key';
      cacheService.getByPrefix.mockResolvedValue([mockKey]);

      const result = await apiKeyService.getDefaultKey();

      expect(result).toBe(mockKey);
      expect(cacheService.getByPrefix).toHaveBeenCalledWith('pf:api-key');
      expect(apiKeyRepository.getKeys).not.toHaveBeenCalled();
    });

    it('should return the key from db if not in cache', async () => {
      const mockKey = 'mock-key';
      cacheService.getByPrefix.mockResolvedValue([]);
      apiKeyRepository.getKeys.mockResolvedValue([{ key: mockKey }]);

      const result = await apiKeyService.getDefaultKey();

      expect(result).toBe(mockKey);
      expect(cacheService.getByPrefix).toHaveBeenCalledWith('pf:api-key');
      expect(apiKeyRepository.getKeys).toHaveBeenCalled();
    });
  });

  describe('pushKeysToCache', () => {
    it('should push all keys to the cache and log the operation', async () => {
      const mockKeys = [{ key: 'key1' }, { key: 'key2' }];
      apiKeyRepository.getKeys.mockResolvedValue(mockKeys);

      await apiKeyService.pushKeysToCache();

      expect(apiKeyRepository.getKeys).toHaveBeenCalled();
      expect(cacheService.setByKeyPrefix).toHaveBeenCalledWith('pf:api-key', 0, 'key1');
      expect(cacheService.setByKeyPrefix).toHaveBeenCalledWith('pf:api-key', 1, 'key2');
    });
  });

  describe('createKey', () => {
    it('should create a new API key, clear existing keys, and save the new key to the cache', async () => {
      const mockKey = 'new-api-key';
      jest.spyOn(apiKeyService as any, 'generateApiKey').mockReturnValue(mockKey);
      apiKeyRepository.createKey.mockResolvedValue({ key: mockKey });

      const result = await apiKeyService.createKey();

      expect(result).toBe(mockKey);
      expect(cacheService.delByPrefix).toHaveBeenCalledWith('pf:api-key');
      expect(apiKeyRepository.removeKeys).toHaveBeenCalled();
      expect(apiKeyRepository.createKey).toHaveBeenCalledWith({ key: mockKey });
      expect(cacheService.setByKeyPrefix).toHaveBeenCalledWith('pf:api-key', 0, mockKey);
    });
  });
});
