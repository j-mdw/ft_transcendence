import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AppGateway } from './gateway';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [AppGateway],
})
export class GatewayModule {}
