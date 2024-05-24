import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { PageRequest, PageResponse } from '@common/dto';
import { NewsService } from '../service/news.service';
import { ApiTags } from '@nestjs/swagger';
import { NewsDto } from '../dto/news.dto';

@ApiTags('news')
@Controller('news')
@UseGuards(ApiKeyGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/top')
  async getTopNews(@Query() request: PageRequest): Promise<PageResponse<NewsDto>> {
    return this.newsService.getTopNews(request);
  }

  // @Get('/')
  // async getNews(@Query() request: NewsRequestDto): Promise<PageResponse<NewsDto>> {
  //   return this.newsService.getNews(request);
  // }
}
