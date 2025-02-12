import {
  ArticleResponse,
  CategoryFeedRequest,
  HeadlineFeedRequest,
  HeadlineFeedResponse,
  RelatedArticlesRequest,
  SearchArticleRequest,
} from '../dto';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PageResponse } from '@pulsefeed/common';
import { NewsBlock } from '../../news-block';
import { ArticleService } from '../service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * Get headline feed.
   * @param request the headline feed request.
   */
  @Post('/headline-feed')
  @HttpCode(200)
  async getHeadlineFeed(
    @Body() request: HeadlineFeedRequest,
  ): Promise<HeadlineFeedResponse<NewsBlock>> {
    return this.articleService.getHeadlineFeedPageResponse(request);
  }

  /**
   * Get category feed.
   * @param request category feed request.
   */
  @Post('/category-feed')
  @HttpCode(200)
  async getCategoryFeed(@Body() request: CategoryFeedRequest): Promise<PageResponse<NewsBlock>> {
    return this.articleService.getCategoryFeedPageResponse(request);
  }

  /**
   * Find related articles.
   */
  @Post('/related-articles')
  @HttpCode(200)
  async getRelatedArticles(@Body() request: RelatedArticlesRequest): Promise<ArticleResponse[]> {
    return this.articleService.getRelatedArticlesResponse(request);
  }

  /**
   * Search articles by terms.
   */
  @Post('/search')
  @HttpCode(200)
  async searchArticles(@Body() request: SearchArticleRequest): Promise<PageResponse<NewsBlock>> {
    return this.articleService.searchArticles(request);
  }
}
