import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../auth/guard/api-key.guard';
import { SourceService } from '../service/source.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageRequest, PageResponse } from '@common/dto';
import { SourceDto } from '../dto/source.dto';
import { Cacheable } from 'nestjs-cacheable';

@ApiTags('Source')
@Controller('source')
@UseGuards(ApiKeyGuard)
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get('/list')
  @ApiOkResponsePaginated(SourceDto)
  @ApiOperation({ description: 'Get all enabled news sources' })
  @Cacheable({
    key: ({ page }: PageRequest) => `source:list:page:${page}`,
    namespace: 'pf',
  })
  async listSource(@Query() request: PageRequest): Promise<PageResponse<SourceDto>> {
    return this.sourceService.getEnabledSourceList(request);
  }
}
