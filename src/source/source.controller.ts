import { ApiOkResponsePaginated } from '@common/decorator/api-ok-response-paginated.decorator';
import { DEFAULT_PAGE_SIZE, DEFAULT_TTL } from '../shared/constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageRequest, PageResponse } from '@common/dto';
import { Body, Controller, Get } from '@nestjs/common';
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
  async listSource(@Body() { page }: PageRequest): Promise<PageResponse<SourceDto>> {
    const limit = DEFAULT_PAGE_SIZE;
    const [data, total] = await this.sourceService.getSupportedSources(page, DEFAULT_PAGE_SIZE);

    const response = data.map((source) => SourceDto.fromModel(source));
    return new PageResponse<SourceDto>(response, total, page, limit);
  }
}
