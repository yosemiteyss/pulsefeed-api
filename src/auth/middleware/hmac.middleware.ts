import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from '../service/api-key.service';
import * as crypto from 'crypto';

@Injectable()
export class HmacMiddleware implements NestMiddleware {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const signature = req.headers['x-signature'] as string;
    if (!signature) {
      throw new UnauthorizedException('Invalid signature');
    }

    const stringToSign =
      `${req.method} ` +
      `${req.originalUrl}\n` +
      `${req.headers['content-type']}\n` +
      `${JSON.stringify(req.body)}`;

    const secretKey = await this.apiKeyService.getDefaultKey();
    if (!secretKey) {
      throw new UnauthorizedException();
    }

    const computedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(stringToSign)
      .digest('hex');

    if (computedSignature !== signature) {
      throw new UnauthorizedException('Invalid signature');
    }

    next();
  }
}
