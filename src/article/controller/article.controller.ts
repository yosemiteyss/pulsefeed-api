import { CategoryFeedRequest, LatestFeedRequest } from '../dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { PageResponse } from '@pulsefeed/common';
import { ArticleService } from '../service';
import { NewsBlock } from '../../news-block';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleFeedService: ArticleService) {}

  @Get('/latest')
  @ApiOperation({ description: 'Get latest feed' })
  async getLatestFeed(@Body() request: LatestFeedRequest): Promise<PageResponse<NewsBlock>> {
    return this.articleFeedService.getLatestFeedPageResponse(request);
  }

  @Get('/feed')
  // @ApiOkResponsePaginated(NewsBlock)
  @ApiOperation({ description: 'Get category feed' })
  async getCategoryFeed(@Body() request: CategoryFeedRequest): Promise<PageResponse<NewsBlock>> {
    return this.articleFeedService.getCategoryFeedPageResponse(request);
  }

  // @Get('/home')
  // @ApiOperation({ description: 'Get home feed' })
  // @Cacheable({
  //   key: (request: ArticleSectionRequestDto) => {
  //     const publishedBefore = ArticleService.getArticleRequestPublishedTime();
  //     return cacheKeyArticleFeed(request, publishedBefore);
  //   },
  //   ttl: TWELVE_HOUR_IN_MS,
  // })
  // async listFeed(
  //   @Body() { language, sectionKey }: ArticleSectionRequestDto,
  // ): Promise<ArticleSectionDto> {
  //   const feed = await this.articleService.getFeed(language, sectionKey);
  //
  //   return {
  //     category: CategoryResponse.fromModel(feed.category),
  //     articles: feed.articles.map((result) => ArticleResponse.fromModel(result.article)),
  //     nextSectionKey: feed.nextSectionKey,
  //   };
  // }
}
