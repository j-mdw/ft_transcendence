import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { AppGateway } from './gateway';
import { GatewayService } from './gateway.service';

@Module({
  imports: [AuthModule, UserModule, ChannelModule],
  controllers: [],
  providers: [AppGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
