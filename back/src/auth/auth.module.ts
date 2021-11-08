import { Module, HttpModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy'
import { UsersModule } from '../user/user.module';
import { UsersService } from '../user/user.service';
import { school42Strategy } from './42.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.Strategy';

@Module({
  imports: [
    UsersModule, 
    HttpModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '24h',
        },
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, school42Strategy, JwtStrategy],
})
export class AuthModule {}