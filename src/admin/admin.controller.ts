import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnableSourceDto } from '../source/dto/enable-source.dto';
import { SourceService } from '../source/service/source.service';
import { SourceDto } from '../source/dto/source.dto';
import { AuthService } from '../auth/auth.service';
import { AdminGuard } from './guard/admin.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly sourceService: SourceService,
  ) {}

  @Post('/create-api-key')
  async createApiKey(): Promise<CreateApiKeyResponseDto> {
    const key = await this.authService.createApiKey();
    return { key };
  }

  @Get('/source/list')
  async getSourceList(): Promise<SourceDto[]> {
    return this.sourceService.getSourceList();
  }

  @Post('/source/enable')
  async enableSource(@Body() request: EnableSourceDto) {
    return this.sourceService.setSourceEnabled(request);
  }
}
