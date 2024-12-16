import { CacheService, PageResponse, PrismaService } from '@pulsefeed/common';
import { INestApplication, LoggerService } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_PAGE_SIZE } from '../../../shared';
import { SourceModule } from '../../source.module';
import { SourceService } from '../../service';
import { SourceResponse } from '../../dto';
import request from 'supertest';

describe('SourceController', () => {
  let app: INestApplication;
  let sourceService: DeepMockProxy<SourceService>;
  let prismaService: DeepMockProxy<PrismaService>;
  let cacheService: DeepMockProxy<CacheService>;
  let loggerService: DeepMockProxy<LoggerService>;

  beforeAll(async () => {
    sourceService = mockDeep<SourceService>();
    prismaService = mockDeep<PrismaService>();
    cacheService = mockDeep<CacheService>();
    loggerService = mockDeep<LoggerService>();

    const module: TestingModule = await Test.createTestingModule({
      imports: [SourceModule],
    })
      .overrideProvider(SourceService)
      .useValue(sourceService)
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .overrideProvider(CacheService)
      .useValue(cacheService)
      .overrideProvider(WINSTON_MODULE_NEST_PROVIDER)
      .useValue(loggerService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('(GET) /source/list', async () => {
    const mockedDtos: PageResponse<SourceResponse> = new PageResponse(
      [new SourceResponse('id', 'title', 'link', 'imageUrl', 'description')],
      1,
      1,
      DEFAULT_PAGE_SIZE,
    );
    sourceService.getSourcePageResponse.mockResolvedValue(mockedDtos);
    request(app.getHttpServer()).get('/source/list').expect(200).expect(mockedDtos);
  });
});
