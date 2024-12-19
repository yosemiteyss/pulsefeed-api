import { LanguageListResponse, LanguageResponse } from '../dto';
import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LanguageService } from '../service';

@ApiTags('language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  /**
   * Get supported languages.
   */
  @Post('/list')
  @HttpCode(200)
  @ApiOkResponse({ type: LanguageResponse, isArray: true })
  async listLanguage(): Promise<LanguageListResponse> {
    return this.languageService.getLanguageListResponse();
  }
}
