import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { NewsRequestDto } from '../dto/news-request.dto';
import { NewsService } from '../service/news.service';
import { PageResponse } from '@common/dto';
import { ApiTags } from '@nestjs/swagger';
import { NewsDto } from '../dto/news.dto';

@ApiTags('news')
@Controller('news')
@UseGuards(ApiKeyGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/list')
  async getNewsList(@Query() request: NewsRequestDto): Promise<PageResponse<NewsDto>> {
    return this.newsService.getNews(request);
  }
}
