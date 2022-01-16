import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { JwtTwoFactorGuard } from './jwt-two-factor.guard';
import { CreateUserDTO, UserDTO } from 'src/user/user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: UserDTO = await this.authService.addUser(req.user);
    const token = this.jwtService.sign({ userId: user.id });
    const token2fa = this.jwtService.sign({ userId: user.id, twofa: true });
    if (user.isTwoFactorAuthenticationEnabled) {
      response.cookie('token2fa', token2fa, {
        httpOnly: true,
      });
    } else {
      response.cookie('access_token', token, {
        httpOnly: true,
      });
    }
    return { user };
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  school42Auth() {}

  @Get('42/redirect')
  @UseGuards(AuthGuard('42'))
  async school42AuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: UserDTO = await this.authService.addUser(req.user);
    const token = this.jwtService.sign({ userId: user.id });
    const token2fa = this.jwtService.sign({ userId: user.id, twofa: true });

    if (user.isTwoFactorAuthenticationEnabled) {
      response.cookie('token2fa', token2fa, {
        httpOnly: true,
      });
    } else {
      response.cookie('access_token', token, {
        httpOnly: true,
      });
    }
    return { user };
  }

  @Get('me/2fa')
  @UseGuards(AuthGuard('jwt'))
  get2fa(@Req() req): string {
    return req.user.pseudo;
  }

  @Get('me/jwt2fa')
  @UseGuards(JwtTwoFactorGuard)
  getjwt2fa(@Req() req): string {
    return req.user;
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return;
  }
}
