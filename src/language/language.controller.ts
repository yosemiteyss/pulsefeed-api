import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { Controller, Get } from '@nestjs/common';
import { LanguageDto } from './dto';

@ApiTags('language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('/list')
  @ApiOperation({ description: 'Get supported languages' })
  @ApiOkResponse({ type: LanguageDto, isArray: true })
  async listLanguage(): Promise<LanguageDto[]> {
    const languages = await this.languageService.getSupportedLanguages();
    return languages.map((language) => LanguageDto.fromModel(language));
  }
}
