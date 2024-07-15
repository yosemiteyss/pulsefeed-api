import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { ArticleListRequestDto } from './dto/article-list-request.dto';
import { HomeFeedRequestDto } from './dto/home-feed-request-dto';
import { DEFAULT_PAGE_SIZE } from '../shared/constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
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
  async listArticle(@Query() request: ArticleListRequestDto): Promise<PageResponse<ArticleDto>> {
    const publishedBefore = ArticleService.getArticleRequestPublishedTime();
    return this.articleService.getArticlesByOpts({
      page: request.page,
      limit: DEFAULT_PAGE_SIZE,
      category: request.category,
      language: request.language,
      sourceId: request.sourceId,
      publishedBefore: publishedBefore,
    });
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
  async getHomeFeed(@Query() request: HomeFeedRequestDto): Promise<HomeFeedDto> {
    return this.articleService.getHomeFeed(request);
  }
}
