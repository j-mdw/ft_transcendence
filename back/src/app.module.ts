import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UsersModule,
    ChatModule,
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule {}
