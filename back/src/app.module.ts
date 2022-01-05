import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppMiddleware } from './app.middleware';
import { JwtModule } from '@nestjs/jwt';
import { RelationshipModule } from './relationship/relationship.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    GatewayModule,
    RelationshipModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
