import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from '../admin.guard';

describe('AdminGuard', () => {
  let adminGuard: AdminGuard;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    adminGuard = module.get<AdminGuard>(AdminGuard);
    configService = module.get(ConfigService);
  });

  it('should return true if authorization header is valid', async () => {
    const mockRequest = {
      headers: {
        authorization: `Bearer valid_key`,
      },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    configService.get.mockReturnValueOnce('valid_key');

    const result = await adminGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should return false if authorization header is missing', async () => {
    const mockRequest = {
      headers: {},
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = await adminGuard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return false if authorization header is invalid', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer invalid_key',
      },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    jest.spyOn(configService, 'get').mockReturnValue('valid_key');

    const result = await adminGuard.canActivate(mockContext);
    expect(result).toBe(false);
  });
});
