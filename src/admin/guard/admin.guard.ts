import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (authorization && authorization.startsWith('Bearer ')) {
      const key = authorization.substring(7);
      return key === this.configService.get<string>('ADMIN_SECRET_KEY');
    }

    return false;
  }
}
