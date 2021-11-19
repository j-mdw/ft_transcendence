import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { Channel, ChannelParticipant } from './channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelParticipant])],
  controllers: [ChannelController],
})
export class ChannelModule {}
