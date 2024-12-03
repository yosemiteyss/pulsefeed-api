import { ApiOkResponsePaginated, PageRequest, PageResponse } from '@pulsefeed/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { SourceService } from './source.service';
import { DEFAULT_PAGE_SIZE } from '../shared';
import { SourceDto } from './dto';

@ApiTags('source')
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get('/list')
  @ApiOkResponsePaginated(SourceDto)
  @ApiOperation({ description: 'Get all enabled sources' })
  async listSource(@Body() { page }: PageRequest): Promise<PageResponse<SourceDto>> {
    const limit = DEFAULT_PAGE_SIZE;
    const [data, total] = await this.sourceService.getSupportedSources(page, limit);

    const response = data.map((source) => SourceDto.fromModel(source));
    return new PageResponse<SourceDto>(response, total, page, limit);
  }
}
