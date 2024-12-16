import { LanguageListResponse, LanguageResponse } from '../../dto';
import { INestApplication, LoggerService } from '@nestjs/common';
import { CacheService, PrismaService } from '@pulsefeed/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LanguageModule } from '../../language.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from '../../service';
import request from 'supertest';

describe('LanguageController', () => {
  let app: INestApplication;
  let languageService: DeepMockProxy<LanguageService>;
  let prismaService: DeepMockProxy<PrismaService>;
  let cacheService: DeepMockProxy<CacheService>;
  let loggerService: DeepMockProxy<LoggerService>;

  beforeAll(async () => {
    languageService = mockDeep<LanguageService>();
    prismaService = mockDeep<PrismaService>();
    cacheService = mockDeep<CacheService>();
    loggerService = mockDeep<LoggerService>();

    const module: TestingModule = await Test.createTestingModule({
      imports: [LanguageModule],
    })
      .overrideProvider(LanguageService)
      .useValue(languageService)
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

  it('(GET) /language/list', async () => {
    const response: LanguageListResponse = new LanguageListResponse([new LanguageResponse('en')]);
    languageService.getLanguageListResponse.mockResolvedValue(response);
    request(app.getHttpServer()).get('/language/list').expect(200).expect(response);
  });
});
