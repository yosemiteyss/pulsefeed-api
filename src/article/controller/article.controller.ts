import {
  CategoryFeedRequest,
  LatestFeedRequest,
  LatestFeedResponse,
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
   * Get latest feed.
   * @param request latest feed request.
   */
  @Post('/latest-feed')
  @HttpCode(200)
  async getLatestFeed(@Body() request: LatestFeedRequest): Promise<LatestFeedResponse<NewsBlock>> {
    return this.articleService.getLatestFeedPageResponse(request);
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
   * Search articles by terms.
   */
  @Post('/search')
  @HttpCode(200)
  async searchArticles(@Body() request: SearchArticleRequest): Promise<PageResponse<NewsBlock>> {
    return this.articleService.searchArticles(request);
  }
}
