import { Controller, Get, Post, HttpException, Redirect, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RelationId } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService,
    private jwtService: JwtService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    ///const data = this.appService.googleLogin(req)
    const data = await this.appService.addingUser(req)
    return {data}

  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async school42Auth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('42/redirect'))
  async school42AuthRedirect(@Req() req) {
    const data = this.appService.school42Login(req)
    //const data = await this.appService.addingUser(req)
    return {data}
  }

  @Get('test')
  test() {
    return 'Hello World!';
  }

  @Post('login')
  login(@Res() response: Response) {
    // Do username+password check here.

    const userId = 'dummy';

    const payload = { userId: userId };
    const token = this.jwtService.sign(payload);

    response
      .cookie('access_token', token, {
        httpOnly: true,
        domain: 'localhost', // your domain here!
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .send({ success: true });
  }

  @Post('hello')
  @UseGuards(AuthGuard('jwt'))
  devices(): string {
    return 'Hello World';
  }

}