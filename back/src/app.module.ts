import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { ConfigModule } from '@nestjs/config';
import { ChannelParticipantModule } from './channelParticipant/channelParticipant.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    // UserModule,
    // ChatModule,
    // ChannelModule,
    // ChannelParticipantModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule {}
