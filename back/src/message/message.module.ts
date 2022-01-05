import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
