import { ApiOkResponsePaginated, PageRequest, PageResponse } from '@pulsefeed/common';
import { Body, Controller, Get } from '@nestjs/common';
import { SourceService } from '../service';
import { ApiTags } from '@nestjs/swagger';
import { SourceResponse } from '../dto';

@ApiTags('source')
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  /**
   * Get all enabled sources.
   * @param request page request.
   */
  @Get('/list')
  @ApiOkResponsePaginated(SourceResponse)
  async listSource(@Body() request: PageRequest): Promise<PageResponse<SourceResponse>> {
    return this.sourceService.getSourcePageResponse(request);
  }
}
