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
import { JwtTwoFactorGuard } from '../jwt-two-factor.guard';


@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly userService: UserService,
    private readonly authenticationService: AuthService,
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

  // @Post('turn-on')
  // @HttpCode(200)
  // @UseGuards(AuthGuard('jwt'))
  // async turnOnTwoFactorAuthentication(
  //   @Req() request,
  //   @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  // ) {
  //   console.log("PouetPouet");
  //   console.log(request.user);
  //   // const isCodeValid =
  //   //   this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
  //   //     twoFactorAuthenticationCode,
  //   //     request.user,
  //   //   );
  //   // if (!isCodeValid) {
  //   //   throw new UnauthorizedException('Wrong authentication code');
  //   // }
  //   // await this.userService.turnOnTwoFactorAuthentication(request.user.id);
  // }

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
      console.log('time to cry');
      throw new UnauthorizedException('Wrong authentication code');
    } else {
      console.log('party time !');
      const token = this.jwtService.sign({ userId: req.user.id });
      response.cookie('access_token', token, {
        httpOnly: true,
      });
    }

    return req.user;
  }
}
