import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { PageRequest, PageResponse } from '@common/dto';
import { DEFAULT_TTL } from '../shared/constants';
import { SourceService } from './source.service';
import { Cacheable } from 'nestjs-cacheable';
import { SourceDto } from './dto/source.dto';

@ApiTags('source')
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get('/list')
  @ApiOkResponsePaginated(SourceDto)
  @ApiOperation({ description: 'Get all enabled sources' })
  @Cacheable({
    key: ({ page }: PageRequest) => `pf:source:list:page:${page}`,
    ttl: DEFAULT_TTL,
  })
  async listSource(@Query() request: PageRequest): Promise<PageResponse<SourceDto>> {
    return this.sourceService.getSupportedSources(request);
  }
}
