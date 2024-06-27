import { mockLoggerService } from '../../shared/mock/logger.service.mock';
import { EnableSourceDto } from '../dto/enable-source.dto';
import { DEFAULT_PAGE_SIZE } from '../../shared/constants';
import { SourceRepository } from '../source.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SourceService } from '../source.service';
import { LoggerService } from '@common/logger';
import { SourceDto } from '../dto/source.dto';
import { PageRequest } from '@common/dto';
import { SourceEntity } from '@common/db';

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
            findEnabled: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
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

  describe('getSupportedSources', () => {
    it('should return a paginated list of supported sources', async () => {
      const mockSources: SourceEntity[] = [
        { id: '1', title: 'Source 1', enabled: true },
        { id: '2', title: 'Source 2', enabled: true },
      ];
      const request: PageRequest = { page: 1 };
      const total = 2;

      sourceRepository.findEnabled.mockResolvedValue([mockSources, total]);

      const result = await sourceService.getSupportedSources(request);

      expect(result).toEqual({
        data: mockSources.map((source) => SourceDto.fromEntity(source)),
        total,
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
      });
      expect(sourceRepository.findEnabled).toHaveBeenCalledWith(1, DEFAULT_PAGE_SIZE);
    });
  });

  describe('setSourceEnabled', () => {
    it('should enable a source', async () => {
      const request: EnableSourceDto = { id: '1', enabled: true };
      const mockSource: SourceEntity = { id: '1', title: 'Source 1', enabled: false };

      sourceRepository.find.mockResolvedValue(mockSource);
      sourceRepository.save.mockResolvedValue(undefined);

      await sourceService.setSourceEnabled(request);

      expect(sourceRepository.find).toHaveBeenCalledWith('1');
      expect(sourceRepository.save).toHaveBeenCalledWith({ ...mockSource, enabled: true });
    });

    it('should throw NotFoundException if source is not found', async () => {
      const request: EnableSourceDto = { id: '99', enabled: true };

      sourceRepository.find.mockResolvedValue(null);

      await expect(sourceService.setSourceEnabled(request)).rejects.toThrow(NotFoundException);
    });
  });
});
