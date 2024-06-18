import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SourceService } from '../../source/service/source.service';
import { AuthService } from '../../auth/service/auth.service';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { EnableSourceDto } from '../dto/enable-source.dto';
import { AdminSourceDto } from '../dto/admin-source.dto';
import { SourceDto } from '../../source/dto/source.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guard/admin.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly sourceService: SourceService,
  ) {}

  @Post('/create-api-key')
  @ApiOperation({ description: 'Create a new api key' })
  async createApiKey(): Promise<CreateApiKeyDto> {
    const key = await this.authService.createApiKey();
    return { key };
  }

  @Get('/source-list')
  @ApiOperation({ description: 'List all supported article sources' })
  async listSource(): Promise<AdminSourceDto[]> {
    return this.sourceService.getAdminSourceList();
  }

  @Post('/source-enable')
  @ApiOperation({ description: 'Enable or disable article source' })
  async enableSource(@Body() request: EnableSourceDto): Promise<SourceDto> {
    return this.sourceService.setSourceEnabled(request);
  }
}
