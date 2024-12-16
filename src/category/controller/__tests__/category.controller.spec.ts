import { CategoryListResponse, CategoryResponse } from '../../dto';
import { CacheService, PrismaService } from '@pulsefeed/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CategoryModule } from '../../category.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CategoryService } from '../../service';
import request from 'supertest';

describe('CategoryController', () => {
  let app: INestApplication;
  let categoryService: DeepMockProxy<CategoryService>;
  let prismaService: DeepMockProxy<PrismaService>;
  let cacheService: DeepMockProxy<CacheService>;

  beforeAll(async () => {
    categoryService = mockDeep<CategoryService>();
    prismaService = mockDeep<PrismaService>();
    cacheService = mockDeep<CacheService>();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CategoryModule],
    })
      .overrideProvider(CategoryService)
      .useValue(categoryService)
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .overrideProvider(CacheService)
      .useValue(cacheService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('(GET) /category/list', async () => {
    const response: CategoryListResponse = new CategoryListResponse([
      new CategoryResponse('key', 'title', 1),
    ]);
    categoryService.getCategoryListResponse.mockResolvedValue(response);
    request(app.getHttpServer()).get('/category/list').expect(200).expect(response);
  });
});
