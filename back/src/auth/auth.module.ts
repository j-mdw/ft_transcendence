import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { UserModule } from 'src/user/user.module';
import { school42Strategy } from './42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.Strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, school42Strategy, JwtStrategy],
})
export class AuthModule {}
