import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { UserModule } from 'src/user/user.module';
import { school42Strategy } from './42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.Strategy';
import { TwoFactorAuthenticationService } from './twoFactor/twoFactorAuthentication.service';
import { TwoFactorAuthenticationController } from './twoFactor/twoFactorAuthentication.controller';
import { JwtTwoFactorStrategy } from './jwt-two-factor.strategy';

@Module({
  controllers: [AuthController, TwoFactorAuthenticationController],
  providers: [
    AuthService,
    GoogleStrategy,
    school42Strategy,
    JwtStrategy,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    UserModule,
  ],
})
export class AuthModule {}
