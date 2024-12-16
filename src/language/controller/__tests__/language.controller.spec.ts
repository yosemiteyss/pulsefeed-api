import { CacheService, LoggerModule, PrismaService } from '@pulsefeed/common';
import { LanguageListResponse, LanguageResponse } from '../../dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { LanguageModule } from '../../language.module';
import { Test, TestingModule } from '@nestjs/testing';
import { MockLoggerModule } from '../../../shared';
import { INestApplication } from '@nestjs/common';
import { LanguageService } from '../../service';
import request from 'supertest';

describe('LanguageController', () => {
  let app: INestApplication;
  let languageService: DeepMockProxy<LanguageService>;
  let prismaService: DeepMockProxy<PrismaService>;
  let cacheService: DeepMockProxy<CacheService>;

  beforeAll(async () => {
    languageService = mockDeep<LanguageService>();
    prismaService = mockDeep<PrismaService>();
    cacheService = mockDeep<CacheService>();

    const module: TestingModule = await Test.createTestingModule({
      imports: [LanguageModule],
    })
      .overrideModule(LoggerModule)
      .useModule(MockLoggerModule)
      .overrideProvider(LanguageService)
      .useValue(languageService)
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .overrideProvider(CacheService)
      .useValue(cacheService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('(GET) /language/list', async () => {
    const response: LanguageListResponse = new LanguageListResponse([new LanguageResponse('en')]);
    languageService.getLanguageListResponse.mockResolvedValue(response);
    request(app.getHttpServer()).get('/language/list').expect(200).expect(response);
  });
});
