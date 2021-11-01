import { Module, HttpModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy'
import { UsersModule } from '../user/user.module';
import { UsersService } from '../user/user.service';
import { school42Strategy } from './42.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, 
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, school42Strategy],
})
export class AuthModule {}