import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelParticipant } from './channelParticipant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelParticipant])],
  controllers: [],
})
export class ChannelParticipantModule {}
