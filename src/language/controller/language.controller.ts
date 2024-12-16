import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageListResponse, LanguageResponse } from '../dto';
import { Controller, Get } from '@nestjs/common';
import { LanguageService } from '../service';

@ApiTags('language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get supported languages' })
  @ApiOkResponse({ type: LanguageResponse, isArray: true })
  async listLanguage(): Promise<LanguageListResponse> {
    return this.languageService.getLanguageListResponse();
  }
}
