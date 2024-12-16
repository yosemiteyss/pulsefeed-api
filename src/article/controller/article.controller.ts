import { LatestFeedResponse } from '../dto/latest-feed.response';
import { CategoryFeedRequest, LatestFeedRequest } from '../dto';
import { Body, Controller, Get } from '@nestjs/common';
import { PageResponse } from '@pulsefeed/common';
import { NewsBlock } from '../../news-block';
import { ArticleService } from '../service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleFeedService: ArticleService) {}

  /**
   * Get latest feed.
   * @param request latest feed request.
   */
  @Get('/latest-feed')
  async getLatestFeed(@Body() request: LatestFeedRequest): Promise<LatestFeedResponse<NewsBlock>> {
    return this.articleFeedService.getLatestFeedPageResponse(request);
  }

  /**
   * Get category feed.
   * @param request category feed request.
   */
  @Get('/category-feed')
  async getCategoryFeed(@Body() request: CategoryFeedRequest): Promise<PageResponse<NewsBlock>> {
    return this.articleFeedService.getCategoryFeedPageResponse(request);
  }
}
