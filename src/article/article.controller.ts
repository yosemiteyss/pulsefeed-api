import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { ArticleSectionRequestDto } from './dto/article-section-request.dto';
import { ArticleListRequestDto } from './dto/article-list-request.dto';
import { ArticleSectionDto } from './dto/article-section.dto';
import { CategoryDto } from '../category/dto/category.dto';
import { DEFAULT_PAGE_SIZE } from '../shared/constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
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
    const limit = DEFAULT_PAGE_SIZE;
    const publishedBefore = ArticleService.getArticleRequestPublishedTime();

    const [data, total] = await this.articleService.getArticleList(
      {
        page: request.page,
        limit: limit,
        category: request.category,
        language: request.language,
        sourceId: request.sourceId,
        publishedBefore: publishedBefore,
      },
      request.excludeHomeArticles ?? false,
    );

    const articleList = data.map((article) => ArticleDto.fromModel(article));
    return new PageResponse<ArticleDto>(articleList, total, request.page, limit);
  }

  @Get('/home')
  @ApiOperation({ description: 'Get home feed' })
  @Cacheable({
    key: (request: ArticleSectionRequestDto) => {
      const publishedBefore = ArticleService.getArticleRequestPublishedTime();
      return `pf:article:home:request:${JSON.stringify(request)}:publishedBefore:${publishedBefore}`;
    },
    ttl: 2 * 60 * 60 * 1000, // 4 hours
  })
  async listHomeFeed(
    @Body() { language, sectionKey }: ArticleSectionRequestDto,
  ): Promise<ArticleSectionDto> {
    const section = await this.articleService.getHomeFeed(language, sectionKey);

    return {
      category: CategoryDto.fromModel(section.category),
      articles: section.articles.map((article) => ArticleDto.fromModel(article)),
      nextSectionKey: section.nextSectionKey,
    };
  }
}
