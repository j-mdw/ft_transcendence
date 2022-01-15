import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
  Body,
  HttpCode,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
import { UserService } from '../../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private jwtService: JwtService,
  ) {}

  @Post('generate')
  async register(@Res() response: Response, @Req() request) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        request.body,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl,
    );
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt-two-factor'))
  async authenticate(
    @Req() req,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode.toString(),
        req.user.twoFactorAuthenticationSecret,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    } else {
      const token = this.jwtService.sign({ userId: req.user.id });
      response.cookie('access_token', token, {
        httpOnly: true,
      });
    }
    return req.user;
  }
}
