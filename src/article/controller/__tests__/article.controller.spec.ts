import {
  CategoryFeedRequest,
  HeadlineFeedRequest,
  RelatedArticlesRequest,
  SearchArticleRequest,
} from '../../dto';
import { ArticleCategoryEnum, LanguageEnum } from '@pulsefeed/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ArticleController } from '../article.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../../service';

describe('ArticleController', () => {
  let articleController: ArticleController;
  let articleService: DeepMockProxy<ArticleService>;

  beforeEach(async () => {
    articleService = mockDeep<ArticleService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleController,
        {
          provide: ArticleService,
          useValue: articleService,
        },
      ],
    }).compile();

    articleController = module.get(ArticleController);
  });

  describe('getHeadlineFeed', () => {
    it('should call ArticleService.getHeadlineFeedPage', async () => {
      const request: HeadlineFeedRequest = {
        languageKey: LanguageEnum.en_us,
        feedSection: 'feedSection',
      };

      await articleController.getHeadlineFeed(request);

      expect(articleService.getHeadlineFeedPage).toHaveBeenCalledWith(request);
    });
  });

  describe('getCategoryFeed', () => {
    it('should call ArticleService.getCategoryFeedPage', async () => {
      const request: CategoryFeedRequest = {
        languageKey: LanguageEnum.en_us,
        categoryKey: ArticleCategoryEnum.LOCAL,
        page: 1,
      };

      await articleController.getCategoryFeed(request);

      expect(articleService.getCategoryFeedPage).toHaveBeenCalledWith(request);
    });
  });

  describe('getRelatedArticles', () => {
    it('should call ArticleService.getRelatedArticles', async () => {
      const request: RelatedArticlesRequest = {
        articleId: 'articleId',
      };

      await articleController.getRelatedArticles(request);

      expect(articleService.getRelatedArticles).toHaveBeenCalledWith(request);
    });
  });

  describe('searchArticles', () => {
    it('should call ArticleService.searchArticles', async () => {
      const request: SearchArticleRequest = {
        languageKey: LanguageEnum.en_us,
        term: 'term',
        page: 1,
      };

      await articleController.searchArticles(request);

      expect(articleService.searchArticles).toHaveBeenCalledWith(request);
    });
  });
});
