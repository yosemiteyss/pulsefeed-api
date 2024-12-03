import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiKeyService } from '../api-key.service';
import * as crypto from 'crypto';

@Injectable()
export class HmacMiddleware implements NestMiddleware {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const signature = req.headers['x-signature'] as string;
    const timestamp = req.headers['x-timestamp'] as string;

    if (!signature) {
      this.logger.error(`Invalid signature: ${signature}`, HmacMiddleware.name);
      throw new UnauthorizedException();
    }

    if (!timestamp) {
      this.logger.error(`Invalid timestamp: ${timestamp}`, HmacMiddleware.name);
      throw new UnauthorizedException();
    }

    const secretKey = await this.apiKeyService.getDefaultKey();
    if (!secretKey) {
      throw new UnauthorizedException();
    }

    // Validate timestamp within a reasonable tolerance (e.g. within 5 minutes)
    const timeDiffMs = 5 * 60 * 1000;
    const reqTimestamp = parseInt(timestamp, 10);

    if (isNaN(reqTimestamp) || Date.now() - reqTimestamp > timeDiffMs) {
      this.logger.error(`Expired timestamp: ${timestamp} > ${reqTimestamp}`, HmacMiddleware.name);
      throw new UnauthorizedException();
    }

    const stringToSign =
      `${req.method} ` + `${req.originalUrl}\n` + `${timestamp}\n` + `${JSON.stringify(req.body)}`;

    //this.logger.log(`stringToSign: ${stringToSign}`, HmacMiddleware.name);

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
