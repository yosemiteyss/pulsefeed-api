import {
  ArticleListRequestDto,
  ArticleSectionDto,
  ArticleDto,
  ArticleSectionRequestDto,
} from './dto';
import { ApiOkResponsePaginated, PageResponse } from '@pulsefeed/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { ArticleService } from './article.service';
import { DEFAULT_PAGE_SIZE } from '../shared';
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
      return `pf:article:list:request:${JSON.stringify(request)}:publishedBefore:${publishedBefore}`;
    },
    ttl: 2 * 60 * 60 * 1000, // 4 hours
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

    const articleList = data.map((article) => ArticleDto.fromModel(article));
    return new PageResponse<ArticleDto>(articleList, total, request.page, limit);
  }

  @Get('/home')
  @ApiOperation({ description: 'Get home feed' })
  @Cacheable({
    key: (request: ArticleSectionRequestDto) => {
      const publishedBefore = ArticleService.getArticleRequestPublishedTime();
      return `pf:article:feed:request:${JSON.stringify(request)}:publishedBefore:${publishedBefore}`;
    },
    ttl: 2 * 60 * 60 * 1000, // 4 hours
  })
  async listFeed(
    @Body() { language, sectionKey }: ArticleSectionRequestDto,
  ): Promise<ArticleSectionDto> {
    const section = await this.articleService.getFeed(language, sectionKey);

    return {
      category: CategoryDto.fromModel(section.category),
      articles: section.articles.map((article) => ArticleDto.fromModel(article)),
      nextSectionKey: section.nextSectionKey,
    };
  }
}
