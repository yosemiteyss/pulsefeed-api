import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { SourceService } from '../service/source.service';
import { PageRequest, PageResponse } from '@common/dto';
import { SourceDto } from '../dto/source.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('source')
@Controller('source')
@UseGuards(ApiKeyGuard)
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get('/')
  async getSourceList(@Query() request: PageRequest): Promise<PageResponse<SourceDto>> {
    return this.sourceService.getSourceList(request);
  }
}
