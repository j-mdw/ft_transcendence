import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AppGateway } from './gateway';
import { GatewayService } from './gateway.service';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [AppGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
