import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { PageRequest, PageResponse } from '@common/dto';
import { SourceService } from './source.service';
import { Cacheable } from 'nestjs-cacheable';
import { SourceDto } from './dto/source.dto';

@ApiTags('Source')
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get('/list')
  @ApiOkResponsePaginated(SourceDto)
  @ApiOperation({ description: 'Get all enabled sources' })
  @Cacheable({
    key: ({ page }: PageRequest) => `source:list:page:${page}`,
    namespace: 'pf',
  })
  async listSource(@Query() request: PageRequest): Promise<PageResponse<SourceDto>> {
    return this.sourceService.getSupportedSources(request);
  }
}
