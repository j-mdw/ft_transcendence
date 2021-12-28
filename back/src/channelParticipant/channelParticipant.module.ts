import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { ChannelParticipant } from './channelParticipant.entity';
import { ChannelParticipantService } from './channelParticipant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelParticipant]),
    forwardRef(() => UserModule),
  ],
  providers: [ChannelParticipantService],
  controllers: [],
  exports: [ChannelParticipantService],
})
export class ChannelParticipantModule {}
