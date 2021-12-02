import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
// import { ChannelModule } from './channel/channel.module';
import { ConfigModule } from '@nestjs/config';
import { AppMiddleware } from './app.middleware';
import { JwtModule } from '@nestjs/jwt';
// import { ChannelParticipantModule } from './channelParticipant/channelParticipant.module';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '24h',
    //   },
    // }),
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ChatModule,
    // ChannelModule,
    // ChannelParticipantModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
