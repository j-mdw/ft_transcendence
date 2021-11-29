import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDTO } from 'src/user/user.dto';

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
    const user = await this.authService.addUser(req);
    const token = this.jwtService.sign({ userId: user.id });
    response.cookie('access_token', token, {
      httpOnly: true,
    });
    return { user }; //Do we need to return smth here?
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
    return { user };
  }

  // ok to delete?
  @Get('test')
  test(@Res({ passthrough: true }) res: Response) {
    const payload = { userId: 1 };
    const token = this.jwtService.sign(payload);
    console.log('TOKEN');
    res.cookie('access_token', token, {
      httpOnly: true,
    });
  }

  //ok to delete?
  @Post('login')
  login(@Res() response: Response) {
    // Do username+password check here.

    const userId = 'dummy';
    const payload = { userId: userId };
    const token = this.jwtService.sign(payload);

    response
      .cookie('access_token', token, {
        httpOnly: true,
        domain: 'localhost',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .send({ success: true });
  }
}
