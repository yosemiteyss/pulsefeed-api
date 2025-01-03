import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ArticleRepository } from '../article.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@pulsefeed/common';
import { ArticleFilter } from '../../model';

describe('ArticleRepository', () => {
  let articleRepository: ArticleRepository;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaService = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleRepository,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    articleRepository = module.get(ArticleRepository);
  });

  describe('getArticles', () => {
    it('should get from repository with compulsory filter options', async () => {
      const filter: ArticleFilter = {
        page: 1,
        limit: 1,
        languageKey: 'en-us',
        publishedBefore: new Date(),
      };

      prismaService.article.findManyAndCount.mockResolvedValue([[], 0]);
      const result = await articleRepository.getArticles(filter);
      expect(prismaService.article.findManyAndCount).toHaveBeenCalledWith({
        include: {
          source: true,
          category: true,
          languages: true,
        },
        where: {
          isPublished: true,
          languages: {
            some: {
              languageKey: filter.languageKey,
            },
          },
          publishedAt: {
            lt: filter.publishedBefore,
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
      });
      expect(result).toEqual([[], 0]);
    });

    it('should get from repository with optional filter options', async () => {
      const filter: ArticleFilter = {
        page: 1,
        limit: 1,
        languageKey: 'en-us',
        publishedBefore: new Date(),
        categoryKey: 'category',
        sourceId: 'source',
        excludeIds: ['1', '2'],
        searchTerm: 'term',
      };

      prismaService.article.findManyAndCount.mockResolvedValue([[], 0]);
      const result = await articleRepository.getArticles(filter);
      expect(prismaService.article.findManyAndCount).toHaveBeenCalledWith({
        include: {
          source: true,
          category: true,
          languages: true,
        },
        where: {
          isPublished: true,
          publishedAt: {
            lt: filter.publishedBefore,
          },
          languages: {
            some: {
              languageKey: filter.languageKey,
            },
          },
          category: {
            key: filter.categoryKey,
          },
          source: {
            id: filter.sourceId,
            enabled: true,
          },
          OR: [
            { title: { contains: filter.searchTerm } },
            { description: { contains: filter.searchTerm } },
          ],
          id: {
            notIn: filter.excludeIds,
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
      });
      expect(result).toEqual([[], 0]);
    });
  });
});
