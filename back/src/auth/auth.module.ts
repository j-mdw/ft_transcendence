import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { UserModule } from 'src/user/user.module';
import { school42Strategy } from './42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.Strategy';
import { JwtGuard } from './jwt.guard';
import { TwoFactorAuthenticationService } from './twoFactor/twoFactorAuthentication.service';

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
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    school42Strategy,
    JwtStrategy,
    JwtGuard,
    TwoFactorAuthenticationService,
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
