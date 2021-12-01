import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ChannelParticipantModule } from 'src/channelParticipant/channelParticipant.module';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';
import { JwtModule } from '@nestjs/jwt';
import { ChannelParticipantModule } from 'src/channelParticipant/channelParticipant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    // forwardRef(() => ChannelParticipantModule),
    forwardRef(() => UserModule),
    forwardRef(() => ChannelParticipantModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [ChannelService],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChannelModule {}
