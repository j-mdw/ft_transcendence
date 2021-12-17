import { Controller, Get, Post, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDTO } from 'src/user/user.dto';
import JwtTwoFactorGuard from './jwt-two-factor.guard';

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
    console.log('Token signed');
    response.cookie('access_token', token, {
      httpOnly: true,
    });
    if(user.isTwoFactorAuthenticationEnabled) {
      return;
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
    console.log('Token signed');
    response.cookie('access_token', token, {
      httpOnly: true,
    });
    // if(user.isTwoFactorAuthenticationEnabled) {
    //   return;
    // }
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
}
