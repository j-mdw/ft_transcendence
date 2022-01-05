import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { JwtModule } from '@nestjs/jwt';
import { ChannelParticipantModule } from 'src/channelParticipant/channelParticipant.module';
import { AuthModule } from 'src/auth/auth.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => ChannelModule),
    forwardRef(() => ChannelParticipantModule),
    // forwardRef(() => MessageModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
