import { CacheService, PageResponse, PrismaService } from '@pulsefeed/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_PAGE_SIZE } from '../../../shared';
import { SourceModule } from '../../source.module';
import { INestApplication } from '@nestjs/common';
import { SourceService } from '../../service';
import { SourceResponse } from '../../dto';
import request from 'supertest';

describe('SourceController', () => {
  let app: INestApplication;
  let sourceService: DeepMockProxy<SourceService>;
  let prismaService: DeepMockProxy<PrismaService>;
  let cacheService: DeepMockProxy<CacheService>;

  beforeAll(async () => {
    sourceService = mockDeep<SourceService>();
    prismaService = mockDeep<PrismaService>();
    cacheService = mockDeep<CacheService>();

    const module: TestingModule = await Test.createTestingModule({
      imports: [SourceModule],
    })
      .overrideProvider(SourceService)
      .useValue(sourceService)
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .overrideProvider(CacheService)
      .useValue(cacheService)
      .compile();

    app = module.createNestApplication();
    await app.init();
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
