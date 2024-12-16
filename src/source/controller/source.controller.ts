import { ApiOkResponsePaginated, PageRequest, PageResponse } from '@pulsefeed/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { SourceService } from '../service';
import { SourceResponse } from '../dto';

@ApiTags('source')
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get('/list')
  @ApiOkResponsePaginated(SourceResponse)
  @ApiOperation({ description: 'Get all enabled sources' })
  async listSource(@Body() request: PageRequest): Promise<PageResponse<SourceResponse>> {
    return this.sourceService.getSourcePageResponse(request);
  }
}
