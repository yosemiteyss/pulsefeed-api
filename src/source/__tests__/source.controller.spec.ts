import { SourceController } from '../source.controller';
import { PageRequest, PageResponse } from '@common/dto';
import { Test, TestingModule } from '@nestjs/testing';
import { SourceService } from '../source.service';
import { SourceDto } from '../dto/source.dto';
import { SourceEntity } from '@common/db';

describe('SourceController', () => {
  let sourceController: SourceController;
  let sourceService: jest.Mocked<SourceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourceController],
      providers: [
        {
          provide: SourceService,
          useValue: {
            getSupportedSources: jest.fn(),
          },
        },
      ],
    }).compile();

    sourceController = module.get<SourceController>(SourceController);
    sourceService = module.get(SourceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listSource', () => {
    it('should return a paginated list of sources', async () => {
      const mockSources: SourceEntity[] = [
        { id: '1', title: 'Source 1', enabled: true },
        { id: '2', title: 'Source 2', enabled: true },
      ];
      const request: PageRequest = { page: 1 };
      const total = 2;
      const pageResponse: PageResponse<SourceDto> = {
        data: mockSources.map((source) => SourceDto.fromEntity(source)),
        total,
        page: 1,
        limit: 10,
      };

      sourceService.getSupportedSources.mockResolvedValue(pageResponse);

      const result = await sourceController.listSource(request);

      expect(result).toEqual(pageResponse);
      expect(sourceService.getSupportedSources).toHaveBeenCalledWith(request);
    });
  });
});
