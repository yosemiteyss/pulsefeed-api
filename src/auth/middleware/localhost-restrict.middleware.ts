import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request, Response, NextFunction } from 'express';

/**
 * Allow access from localhost only.
 */
@Injectable()
export class LocalhostRestrictMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const allowedHost = 'localhost';
    const host = req.hostname;

    if (host !== allowedHost) {
      this.logger.error(
        'Requests are allowed from localhost only',
        LocalhostRestrictMiddleware.name,
      );
      throw new UnauthorizedException();
    }

    next();
  }
}
