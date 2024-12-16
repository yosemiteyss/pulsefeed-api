import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Global, Logger, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: WINSTON_MODULE_NEST_PROVIDER,
      useClass: Logger,
    },
  ],
})
export class MockLoggerModule {}
