import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { SourceRepository } from '../repository/source.repository';
import { EnableSourceDto } from '../dto/enable-source.dto';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguageEnum, Source } from '@common/model';
import { NotFoundException } from '@nestjs/common';
import { SourceService } from '../source.service';
import { LoggerService } from '@common/logger';
import { SourceDto } from '../dto/source.dto';
import { PageRequest } from '@common/dto';

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
          provide: LoggerService,
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
      const request: PageRequest = { page: 1 };
      const total = 2;

      sourceRepository.getEnabledSources.mockResolvedValue([mockSources, total]);

      const result = await sourceService.getSupportedSources(request);

      expect(result).toEqual({
        data: mockSources.map((source) => SourceDto.fromModel(source)),
        total,
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
      });
      expect(sourceRepository.getEnabledSources).toHaveBeenCalledWith(1, DEFAULT_PAGE_SIZE);
    });
  });

  describe('setSourceEnabled', () => {
    it('should enable a source', async () => {
      const request: EnableSourceDto = { id: '1', enabled: true };
      const mockSource: Source = {
        id: '1',
        title: 'Source 1',
        link: 'Link 1',
        languages: [LanguageEnum.en_us],
      };

      sourceRepository.getSourceById.mockResolvedValue(mockSource);
      sourceRepository.setSourceEnabled.mockResolvedValue();

      await sourceService.setSourceEnabled(request);

      expect(sourceRepository.getSourceById).toHaveBeenCalledWith('1');
      expect(sourceRepository.setSourceEnabled).toHaveBeenCalledWith('1', true);
    });

    it('should throw NotFoundException if source is not found', async () => {
      const request: EnableSourceDto = { id: '99', enabled: true };

      sourceRepository.getSourceById.mockResolvedValue(undefined);

      await expect(sourceService.setSourceEnabled(request)).rejects.toThrow(NotFoundException);
    });
  });
});
