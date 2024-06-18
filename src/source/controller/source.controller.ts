import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { SourceService } from '../service/source.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { PageRequest, PageResponse } from '@common/dto';
import { SourceDto } from '../dto/source.dto';
import { Cacheable } from 'nestjs-cacheable';

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
    return this.sourceService.getEnabledSourceList(request);
  }
}
