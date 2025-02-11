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
    return this.trendingService.getTrendingKeywords(request);
  }
}
