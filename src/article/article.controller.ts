import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { ArticleListRequestDto } from './dto/article-list-request.dto';
import { HomeFeedRequestDto } from './dto/home-feed-request-dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { HomeFeedDto } from './dto/home-feed';
import { Cacheable } from 'nestjs-cacheable';
import { PageResponse } from '@common/dto';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/list')
  @ApiOkResponsePaginated(ArticleDto)
  @ApiOperation({ description: 'Get articles' })
  @Cacheable({
    key: (request: ArticleListRequestDto) => {
      const publishedBefore = ArticleService.getArticleRequestPublishedTime();
      return `pf:article:list:request:${JSON.stringify(request)}:publishedBefore:${publishedBefore}`;
    },
    ttl: 2 * 60 * 60 * 1000, // 4 hours
  })
  async listArticle(@Body() request: ArticleListRequestDto): Promise<PageResponse<ArticleDto>> {
    const publishedBefore = ArticleService.getArticleRequestPublishedTime();
    return this.articleService.getArticleList(request, publishedBefore);
  }

  @Get('/home')
  @ApiOperation({ description: 'Get home feed' })
  @Cacheable({
    key: (request: HomeFeedRequestDto) => {
      const publishedBefore = ArticleService.getArticleRequestPublishedTime();
      return `pf:article:home:request:${JSON.stringify(request)}:publishedBefore:${publishedBefore}`;
    },
    ttl: 2 * 60 * 60 * 1000, // 4 hours
  })
  async getHomeFeed(@Body() request: HomeFeedRequestDto): Promise<HomeFeedDto> {
    return this.articleService.getHomeFeed(request);
  }
}
