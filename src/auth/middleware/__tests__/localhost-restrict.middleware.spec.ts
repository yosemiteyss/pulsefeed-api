import { LocalhostRestrictMiddleware } from '../localhost-restrict.middleware';
import { LoggerService, UnauthorizedException } from '@nestjs/common';
import { mockDeep } from 'jest-mock-extended';
import { Request, Response } from 'express';

describe('LocalhostRestrictMiddleware', () => {
  let middleware: LocalhostRestrictMiddleware;
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = mockDeep<LoggerService>();
    middleware = new LocalhostRestrictMiddleware(loggerService);
  });

  it('should call next when the request is from localhost', () => {
    const req = { hostname: 'localhost' } as Request;
    const res = {} as Response;
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when the request is not from localhost', () => {
    const req = { hostname: 'example.com' } as Request;
    const res = {} as Response;
    const next = jest.fn();

    expect(() => middleware.use(req, res, next)).toThrow(UnauthorizedException);
    expect(loggerService.error).toHaveBeenCalledWith(
      'Requests are allowed from localhost only',
      LocalhostRestrictMiddleware.name,
    );
    expect(next).not.toHaveBeenCalled();
  });
});
