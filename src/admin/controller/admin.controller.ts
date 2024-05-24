import { CreateApiKeyResponseDto } from '../dto/create-api-key-response.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SourceService } from '../../source/service/source.service';
import { AuthService } from '../../auth/service/auth.service';
import { EnableSourceDto } from '../dto/enable-source.dto';
import { AdminSourceDto } from '../dto/admin-source.dto';
import { AdminGuard } from '../guard/admin.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly sourceService: SourceService,
  ) {}

  /**
   * Create a new api key.
   */
  @Post('/create-api-key')
  async createApiKey(): Promise<CreateApiKeyResponseDto> {
    const key = await this.authService.createApiKey();
    return { key };
  }

  /**
   * Get all news sources.
   */
  @Get('/list-source')
  async getSourceList(): Promise<AdminSourceDto[]> {
    return this.sourceService.getAdminSourceList();
  }

  /**
   * Enable news source.
   * @param request
   */
  @Post('/enable-source')
  async enableSource(@Body() request: EnableSourceDto) {
    return this.sourceService.setSourceEnabled(request);
  }
}
