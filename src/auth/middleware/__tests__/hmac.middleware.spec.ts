import { LoggerService, UnauthorizedException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { HmacMiddleware } from '../hmac.middleware';
import { ApiKeyService } from '../../service';
import crypto from 'crypto';

describe('HmacMiddleware', () => {
  let hmacMiddleware: HmacMiddleware;
  let mockApiKeyService: DeepMockProxy<ApiKeyService>;
  let loggerService: DeepMockProxy<LoggerService>;

  beforeEach(() => {
    mockApiKeyService = mockDeep<ApiKeyService>();
    loggerService = mockDeep<LoggerService>();
    hmacMiddleware = new HmacMiddleware(mockApiKeyService, loggerService);
  });

  it('should throw UnauthorizedException if signature is missing', async () => {
    const req = { headers: {} };
    const res = {};
    const next = jest.fn();

    await expect(hmacMiddleware.use(req, res, next)).rejects.toThrow(UnauthorizedException);
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if secret key is not found', async () => {
    const req = { headers: { 'x-signature': 'valid-signature' } };
    const res = {};
    const next = jest.fn();

    mockApiKeyService.getDefaultApiKey.mockResolvedValue(undefined);

    await expect(hmacMiddleware.use(req, res, next)).rejects.toThrow(UnauthorizedException);
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if timestamp expired', async () => {
    const timestamp = Date.now() - 10 * 60 * 1000;
    const req = {
      method: 'POST',
      originalUrl: '/api/resource',
      headers: { 'content-type': 'application/json', 'x-timestamp': `${timestamp}` },
      body: { key: 'value' },
    };
    const secretKey = 'secret-key';

    // Compute signature
    const stringToSign =
      `${req.method} ` + `${req.originalUrl}\n` + `${timestamp}\n` + `${JSON.stringify(req.body)}`;

    req.headers['x-signature'] = crypto
      .createHmac('sha256', secretKey)
      .update(stringToSign)
      .digest('hex');

    const res = {};
    const next = jest.fn();

    await expect(hmacMiddleware.use(req, res, next)).rejects.toThrow(UnauthorizedException);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if signatures match', async () => {
    const timestamp = Date.now();
    const req = {
      method: 'POST',
      originalUrl: '/api/resource',
      headers: { 'content-type': 'application/json', 'x-timestamp': `${timestamp}` },
      body: { key: 'value' },
    };
    const secretKey = 'secret-key';

    // Compute signature
    const stringToSign =
      `${req.method} ` + `${req.originalUrl}\n` + `${timestamp}\n` + `${JSON.stringify(req.body)}`;

    req.headers['x-signature'] = crypto
      .createHmac('sha256', secretKey)
      .update(stringToSign)
      .digest('hex');

    const res = {};
    const next = jest.fn();

    mockApiKeyService.getDefaultApiKey.mockResolvedValue(secretKey);

    await hmacMiddleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
