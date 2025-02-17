import { getDeviceInfo } from '../device-info.decorator';
import { ExecutionContext } from '@nestjs/common';
import { mockDeep } from 'jest-mock-extended';

describe('DeviceInfo Decorator', () => {
  it('should extract device info from headers', () => {
    const mockExecutionContext = mockDeep<ExecutionContext>();
    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: () => ({
        headers: {
          'x-os': 'Android',
          'x-os-version': '12',
          'x-app-version': '1.0.0',
          'x-device-model': 'Pixel 6',
        },
      }),
    } as any);

    const result = getDeviceInfo(null, mockExecutionContext);

    expect(result).toEqual({
      os: 'Android',
      osVersion: '12',
      appVersion: '1.0.0',
      deviceModel: 'Pixel 6',
    });
  });

  it('should return unknown when headers are missing', () => {
    const mockExecutionContext = mockDeep<ExecutionContext>();
    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: () => ({
        headers: {},
      }),
    } as any);

    const result = getDeviceInfo(null, mockExecutionContext);

    expect(result).toEqual({
      os: undefined,
      osVersion: undefined,
      appVersion: undefined,
      deviceModel: undefined,
    });
  });
});
