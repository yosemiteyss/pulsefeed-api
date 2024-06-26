import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { ApiKeyRepository } from '../api-key.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from '../api-key.service';
import { LoggerService } from '@common/logger';
import { CacheService } from '@common/cache';

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
            find: jest.fn(),
            save: jest.fn(),
            clear: jest.fn(),
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
          provide: LoggerService,
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
      expect(cacheService.getByPrefix).toHaveBeenCalledWith(apiKeyService['CACHE_PREFIX']);
      expect(apiKeyRepository.find).not.toHaveBeenCalled();
    });

    it('should return the key from db if not in cache', async () => {
      const mockKey = 'mock-key';
      cacheService.getByPrefix.mockResolvedValue([]);
      apiKeyRepository.find.mockResolvedValue([{ key: mockKey }]);

      const result = await apiKeyService.getDefaultKey();

      expect(result).toBe(mockKey);
      expect(cacheService.getByPrefix).toHaveBeenCalledWith(apiKeyService['CACHE_PREFIX']);
      expect(apiKeyRepository.find).toHaveBeenCalled();
    });
  });

  describe('pushKeysToCache', () => {
    it('should push all keys to the cache and log the operation', async () => {
      const mockKeys = [{ key: 'key1' }, { key: 'key2' }];
      apiKeyRepository.find.mockResolvedValue(mockKeys);

      await apiKeyService.pushKeysToCache();

      expect(apiKeyRepository.find).toHaveBeenCalled();
      expect(cacheService.setByKeyPrefix).toHaveBeenCalledWith(
        apiKeyService['CACHE_PREFIX'],
        0,
        'key1',
      );
      expect(cacheService.setByKeyPrefix).toHaveBeenCalledWith(
        apiKeyService['CACHE_PREFIX'],
        1,
        'key2',
      );
    });
  });

  describe('createKey', () => {
    it('should create a new API key, clear existing keys, and save the new key to the cache', async () => {
      const mockKey = 'new-api-key';
      jest.spyOn(apiKeyService as any, 'generateApiKey').mockReturnValue(mockKey);
      apiKeyRepository.save.mockResolvedValue({ key: mockKey });

      const result = await apiKeyService.createKey();

      expect(result).toBe(mockKey);
      expect(cacheService.delByPrefix).toHaveBeenCalledWith(apiKeyService['CACHE_PREFIX']);
      expect(apiKeyRepository.clear).toHaveBeenCalled();
      expect(apiKeyRepository.save).toHaveBeenCalledWith({ key: mockKey });
      expect(cacheService.setByKeyPrefix).toHaveBeenCalledWith(
        apiKeyService['CACHE_PREFIX'],
        0,
        mockKey,
      );
    });
  });
});
