import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LanguageEnum, Source } from '@pulsefeed/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SourceService } from '../source.service';
import { SourceRepository } from '../repository';
import { DEFAULT_PAGE_SIZE } from '../../shared';

describe('SourceService', () => {
  let sourceService: SourceService;
  let sourceRepository: jest.Mocked<SourceRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourceService,
        {
          provide: SourceRepository,
          useValue: {
            getSourceById: jest.fn(),
            getEnabledSources: jest.fn(),
            setSourceEnabled: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    sourceService = module.get<SourceService>(SourceService);
    sourceRepository = module.get(SourceRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSourceId', () => {
    it('should return a source by id', async () => {
      const mockSource: Source = {
        id: '1',
        title: 'Source 1',
        link: 'Link 1',
        languages: [LanguageEnum.en_us],
      };

      sourceRepository.getSourceById.mockResolvedValue(mockSource);

      const result = await sourceService.getSourceById('1');
      expect(result).toBe(mockSource);
    });

    it('should throw NotFoundException if source is not found', async () => {
      sourceRepository.getSourceById.mockResolvedValue(undefined);

      await expect(sourceService.getSourceById('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSupportedSources', () => {
    it('should return a paginated list of supported sources', async () => {
      const mockSources: Source[] = [
        { id: '1', title: 'Source 1', link: 'Link 1', languages: [LanguageEnum.en_us] },
        { id: '2', title: 'Source 2', link: 'Link 2', languages: [LanguageEnum.en_us] },
      ];
      const total = 2;

      sourceRepository.getEnabledSources.mockResolvedValue([mockSources, total]);

      const result = await sourceService.getSupportedSources(1, DEFAULT_PAGE_SIZE);

      expect(result).toEqual([mockSources, 2]);
      expect(sourceRepository.getEnabledSources).toHaveBeenCalledWith(1, DEFAULT_PAGE_SIZE);
    });
  });

  describe('setSourceEnabled', () => {
    it('should enable a source', async () => {
      const mockSource: Source = {
        id: '1',
        title: 'Source 1',
        link: 'Link 1',
        languages: [LanguageEnum.en_us],
      };

      sourceRepository.getSourceById.mockResolvedValue(mockSource);
      sourceRepository.setSourceEnabled.mockResolvedValue();

      await sourceService.setSourceEnabled('1', true);

      expect(sourceRepository.getSourceById).toHaveBeenCalledWith('1');
      expect(sourceRepository.setSourceEnabled).toHaveBeenCalledWith('1', true);
    });

    it('should throw NotFoundException if source is not found', async () => {
      sourceRepository.getSourceById.mockResolvedValue(undefined);
      await expect(sourceService.setSourceEnabled('1', true)).rejects.toThrow(NotFoundException);
    });
  });
});
