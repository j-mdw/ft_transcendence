import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway],
})
export class GatewayModule {}
