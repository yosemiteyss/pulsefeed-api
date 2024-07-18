import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { DEFAULT_TTL } from '../shared/constants';
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
    key: 'pf:language:list',
    ttl: DEFAULT_TTL,
  })
  async listLanguage(): Promise<LanguageDto[]> {
    const languages = await this.languageService.getSupportedLanguages();
    return languages.map((language) => LanguageDto.fromModel(language));
  }
}
