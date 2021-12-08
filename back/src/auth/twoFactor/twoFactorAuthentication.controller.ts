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

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly userService: UserService,
    private readonly authenticationService: AuthService,
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
  @UseGuards(AuthGuard('jwt'))
  async authenticate(
    @Req() request,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode.toString(),
        request.user.twoFactorAuthenticationSecret,
      );
    if (!isCodeValid) {
      console.log('time to cry');
      throw new UnauthorizedException('Wrong authentication code');
    } else {
      console.log('party time !');
    }

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(
        request.user.id,
        true,
      );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }
}
