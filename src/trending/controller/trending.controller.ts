import { TrendingArticlesResponse } from '../dto/trending-articles.response';
import { TrendingArticlesRequest } from '../dto/trending-articles.request';
import { TrendingKeywordsRequest, TrendingKeywordsResponse } from '../dto';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { TrendingService } from '../service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('trending')
@Controller('trending')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  /**
   * Get trending keywords.
   */
  @Post('/keywords')
  @HttpCode(200)
  async getTrendingKeywords(
    @Body() request: TrendingKeywordsRequest,
  ): Promise<TrendingKeywordsResponse> {
    return this.trendingService.getTrendingKeywordsResponse(request);
  }

  /**
   * Get trending articles.
   */
  @Post('/articles')
  @HttpCode(200)
  async getTrendingArticles(
    @Body() request: TrendingArticlesRequest,
  ): Promise<TrendingArticlesResponse> {
    return this.trendingService.getTrendingArticlesResponse(request);
  }
}
