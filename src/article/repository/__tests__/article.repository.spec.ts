import { Article, ArticleCategoryEnum, LanguageEnum, PrismaService } from '@pulsefeed/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ArticleRepository } from '../article.repository';
import { ArticleData, ArticleFilter } from '../../model';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

describe('ArticleRepository', () => {
  let articleRepository: ArticleRepository;
  let prismaService: DeepMockProxy<PrismaService>;

  const articleEntity: Prisma.ArticleGetPayload<{
    include: { source: true; category: true; languages: true };
  }> = {
    id: 'articleId',
    title: 'articleTitle',
    link: 'articleLink',
    description: 'articleDescription',
    sourceId: 'sourceId',
    image: 'articleImage',
    keywords: ['keyword-1', 'keyword-2'],
    publishedAt: new Date(),
    categoryKey: ArticleCategoryEnum.HEALTH,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isPublished: false,
    source: {
      id: 'sourceId',
      title: 'sourceTitle',
      description: 'sourceDescription',
      link: 'sourceLink',
      image: 'sourceImage',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      enabled: true,
    },
    category: {
      key: ArticleCategoryEnum.HEALTH,
      enabled: true,
      priority: new Prisma.Decimal(1.0),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    languages: [
      {
        articleId: 'id',
        languageKey: LanguageEnum.en_us,
      },
    ],
  };

  const article: Article = {
    id: articleEntity.id,
    title: articleEntity.title,
    description: articleEntity.description ?? undefined,
    category: ArticleCategoryEnum.HEALTH,
    sourceId: articleEntity.sourceId,
    image: articleEntity.image ?? undefined,
    link: articleEntity.link ?? undefined,
    languages: [LanguageEnum.en_us],
    keywords: articleEntity.keywords,
    publishedAt: articleEntity.createdAt,
  };

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

  describe('getArticle', () => {
    it('should call findUnique to get article by id', async () => {
      prismaService.article.findUnique.mockResolvedValue(articleEntity);

      const result = await articleRepository.getArticle(articleEntity.id);

      const expected: ArticleData = {
        article: article,
        source: {
          id: articleEntity.source.id,
          title: articleEntity.source.title,
          link: articleEntity.source.link,
          image: articleEntity.source.image ?? undefined,
          description: articleEntity.source.description ?? undefined,
          languages: articleEntity.languages.map(
            (language) => language.languageKey as LanguageEnum,
          ),
        },
        category: {
          key: articleEntity.category.key,
          priority: articleEntity.category.priority.toNumber(),
        },
      };

      expect(result).toEqual(expected);
    });

    it('should return undefined if findUnique returns null', async () => {
      prismaService.article.findUnique.mockResolvedValue(null);

      const result = await articleRepository.getArticle(articleEntity.id);

      expect(result).toBeUndefined();
    });
  });
});
