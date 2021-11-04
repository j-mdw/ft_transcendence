
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({isGlobal: true,}),
    AuthModule,
    UsersModule

  ],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule {}