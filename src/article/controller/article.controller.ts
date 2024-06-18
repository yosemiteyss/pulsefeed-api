import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ArticleRequestDto } from '../dto/article-request.dto';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { ArticleService } from '../service/article.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleDto } from '../dto/article.dto';
import { PageResponse } from '@common/dto';

@ApiTags('Article')
@Controller('article')
@UseGuards(ApiKeyGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/list')
  @ApiOkResponsePaginated(ArticleDto)
  @ApiOperation({ description: 'Get articles' })
  async listArticle(@Query() request: ArticleRequestDto): Promise<PageResponse<ArticleDto>> {
    return this.articleService.getArticles(request);
  }
}
