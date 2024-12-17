import { LanguageListResponse, LanguageResponse } from '../dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { LanguageService } from '../service';

@ApiTags('language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  /**
   * Get supported languages.
   */
  @Post('/list')
  @ApiOkResponse({ type: LanguageResponse, isArray: true })
  async listLanguage(): Promise<LanguageListResponse> {
    return this.languageService.getLanguageListResponse();
  }
}
