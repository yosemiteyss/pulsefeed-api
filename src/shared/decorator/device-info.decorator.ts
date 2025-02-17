import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface DeviceInfo {
  readonly os?: string;
  readonly osVersion?: string;
  readonly appVersion?: string;
  readonly deviceModel?: string;
}

export const getDeviceInfo = (data: unknown, ctx: ExecutionContext): DeviceInfo => {
  const request = ctx.switchToHttp().getRequest();
  return {
    os: request.headers['x-os'],
    osVersion: request.headers['x-os-version'],
    appVersion: request.headers['x-app-version'],
    deviceModel: request.headers['x-device-model'],
  };
};

/**
 * Decorator to get device info from request headers.
 */
export const DeviceInfo = createParamDecorator(getDeviceInfo);
