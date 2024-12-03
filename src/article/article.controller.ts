import {
  ArticleListRequestDto,
  ArticleSectionDto,
  ArticleDto,
  ArticleSectionRequestDto,
} from './dto';
import { cacheKeyArticleFeed, cacheKeyArticleList } from './cache.constants';
import { ApiOkResponsePaginated, PageResponse } from '@pulsefeed/common';
import { DEFAULT_PAGE_SIZE, TWELVE_HOUR_IN_MS } from '../shared';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { ArticleService } from './service/article.service';
import { Cacheable } from 'nestjs-cacheable';
import { CategoryDto } from '../category';

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
      return cacheKeyArticleList(request, publishedBefore);
    },
    ttl: TWELVE_HOUR_IN_MS,
  })
  async listArticle(@Body() request: ArticleListRequestDto): Promise<PageResponse<ArticleDto>> {
    const limit = DEFAULT_PAGE_SIZE;
    const publishedBefore = ArticleService.getArticleRequestPublishedTime();

    const [data, total] = await this.articleService.getArticles(
      {
        page: request.page,
        publishedBefore: publishedBefore,
        limit: limit,
        category: request.category,
        language: request.language,
        sourceId: request.sourceId,
        searchTerm: request.searchTerm,
      },
      request.excludeFeedArticles ?? false,
    );

    const articles = data.map((result) => ArticleDto.fromModel(result.article));
    return new PageResponse<ArticleDto>(articles, total, request.page, limit);
  }

  @Get('/home')
  @ApiOperation({ description: 'Get home feed' })
  @Cacheable({
    key: (request: ArticleSectionRequestDto) => {
      const publishedBefore = ArticleService.getArticleRequestPublishedTime();
      return cacheKeyArticleFeed(request, publishedBefore);
    },
    ttl: TWELVE_HOUR_IN_MS,
  })
  async listFeed(
    @Body() { language, sectionKey }: ArticleSectionRequestDto,
  ): Promise<ArticleSectionDto> {
    const feed = await this.articleService.getFeed(language, sectionKey);

    return {
      category: CategoryDto.fromModel(feed.category),
      articles: feed.articles.map((result) => ArticleDto.fromModel(result.article)),
      nextSectionKey: feed.nextSectionKey,
    };
  }
}
