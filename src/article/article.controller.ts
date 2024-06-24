import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { ArticleRequestDto } from './dto/article-request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { PageResponse } from '@common/dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/list')
  @ApiOkResponsePaginated(ArticleDto)
  @ApiOperation({ description: 'Get articles' })
  async listArticle(@Query() request: ArticleRequestDto): Promise<PageResponse<ArticleDto>> {
    return this.articleService.getArticles(request);
  }
}
