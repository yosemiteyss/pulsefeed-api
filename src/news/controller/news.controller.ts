import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { NewsRequestDto } from '../dto/news-request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsService } from '../service/news.service';
import { PageResponse } from '@common/dto';
import { NewsDto } from '../dto/news.dto';

@ApiTags('News')
@Controller('news')
@UseGuards(ApiKeyGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/list')
  @ApiOkResponsePaginated(NewsDto)
  @ApiOperation({ description: 'Get news items' })
  async listNews(@Query() request: NewsRequestDto): Promise<PageResponse<NewsDto>> {
    return this.newsService.getNews(request);
  }
}
