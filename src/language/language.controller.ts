import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { LanguageDto } from './dto/language.dto';
import { Controller, Get } from '@nestjs/common';
import { Cacheable } from 'nestjs-cacheable';

@ApiTags('language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get supported languages' })
  @ApiOkResponse({ type: LanguageDto, isArray: true })
  @Cacheable({
    key: 'language:list',
    namespace: 'pf',
  })
  async listLanguage(): Promise<LanguageDto[]> {
    return this.languageService.getSupportedLanguages();
  }
}
