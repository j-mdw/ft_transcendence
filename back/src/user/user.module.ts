import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelParticipantModule } from 'src/channelParticipant/channelParticipant.module';
import { AuthModule } from 'src/auth/auth.module';
import { MatchHistoryModule } from 'src/matchHistory/matchHistory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => ChannelModule),
    forwardRef(() => ChannelParticipantModule),
    MatchHistoryModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
