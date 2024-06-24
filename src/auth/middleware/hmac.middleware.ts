import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from '../api-key.service';
import { LoggerService } from '@common/logger';
import * as crypto from 'crypto';

@Injectable()
export class HmacMiddleware implements NestMiddleware {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly logger: LoggerService,
  ) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const contentType = req.headers['content-type'] as string;
    const signature = req.headers['x-signature'] as string;
    const timestamp = req.headers['x-timestamp'] as string;

    if (!signature) {
      this.logger.warn(HmacMiddleware.name, `Invalid signature: ${signature}`);
      throw new UnauthorizedException();
    }

    if (!timestamp) {
      this.logger.warn(HmacMiddleware.name, `Invalid timestamp: ${timestamp}`);
      throw new UnauthorizedException();
    }

    const secretKey = await this.apiKeyService.getDefaultKey();
    if (!secretKey) {
      throw new UnauthorizedException();
    }

    // Validate timestamp within a reasonable tolerance (e.g. within 5 minutes)
    const tolerance = 5 * 60 * 1000;
    const reqTimestamp = parseInt(timestamp, 10);

    if (isNaN(reqTimestamp) || Date.now() - reqTimestamp > tolerance) {
      this.logger.warn(HmacMiddleware.name, `Expired timestamp: ${timestamp} > ${reqTimestamp}`);
      throw new UnauthorizedException();
    }

    const stringToSign =
      `${req.method} ` +
      `${req.originalUrl}\n` +
      `${contentType}\n` +
      `${timestamp}\n` +
      `${JSON.stringify(req.body)}`;

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
