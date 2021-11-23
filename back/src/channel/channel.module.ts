import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelParticipantModule } from 'src/channelParticipant/channelParticipant.module';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    forwardRef(() => ChannelParticipantModule),
    forwardRef(() => UserModule),
  ],
  providers: [ChannelService],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChannelModule {}
