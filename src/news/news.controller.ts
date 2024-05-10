import { Controller, Get, Query } from '@nestjs/common';
import { PageRequest, PageResponse } from '@common/dto';
import { NewsService } from './service/news.service';
import { ApiTags } from '@nestjs/swagger';
import { NewsDto } from './dto/news.dto';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/top')
  async getTopNews(@Query() request: PageRequest): Promise<PageResponse<NewsDto>> {
    return this.newsService.getTopNews(request);
  }
}
