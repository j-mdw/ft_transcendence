import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { UserModule } from 'src/user/user.module';
import { school42Strategy } from './42.strategy.auth';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtGuard } from './jwt.guard';
import { TwoFactorAuthenticationService } from './twoFactor/twoFactorAuthentication.service';
import { TwoFactorAuthenticationController } from './twoFactor/twoFactorAuthentication.controller';
import { JwtTwoFactorStrategy } from './jwt-two-factor.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController, TwoFactorAuthenticationController],
  providers: [
    AuthService,
    GoogleStrategy,
    school42Strategy,
    JwtStrategy,
    JwtGuard,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
  exports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      }, //Needed by app middleware
    }),
    AuthService, //Needed by JwtGuard
  ],
})
export class AuthModule {}
