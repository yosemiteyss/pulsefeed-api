import { mockLoggerService } from '../../../shared/mock/logger.service.mock';
import { UnauthorizedException } from '@nestjs/common';
import { HmacMiddleware } from '../hmac.middleware';
import crypto from 'crypto';

const mockApiKeyService = {
  getDefaultKey: jest.fn(),
};

describe('HmacMiddleware', () => {
  let hmacMiddleware: HmacMiddleware;

  beforeEach(() => {
    hmacMiddleware = new HmacMiddleware(mockApiKeyService as any, mockLoggerService as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    mockApiKeyService.getDefaultKey.mockResolvedValue(undefined);

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
      `${req.method} ` +
      `${req.originalUrl}\n` +
      `${req.headers['content-type']}\n` +
      `${req.headers['x-timestamp']}\n` +
      `${JSON.stringify(req.body)}`;

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
      `${req.method} ` +
      `${req.originalUrl}\n` +
      `${req.headers['content-type']}\n` +
      `${req.headers['x-timestamp']}\n` +
      `${JSON.stringify(req.body)}`;

    req.headers['x-signature'] = crypto
      .createHmac('sha256', secretKey)
      .update(stringToSign)
      .digest('hex');

    const res = {};
    const next = jest.fn();

    mockApiKeyService.getDefaultKey.mockResolvedValue(secretKey);

    await hmacMiddleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
