import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AdminGuard } from './guard/admin.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Post('/create-api-key')
  async createApiKey(): Promise<CreateApiKeyResponseDto> {
    const key = await this.authService.createApiKey();
    return { key };
  }
}
