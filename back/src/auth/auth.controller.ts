import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Param,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from 'src/user/user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private usersService: UsersService,
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
    const data = await this.authService.addUser(req);
    const payload = { userId: data.user.id };
    const token = this.jwtService.sign(payload);
    response.cookie('access_token', token, {
      httpOnly: true,
    });
    // console.log(this.jwtService.decode(token)['userId']);

    return { data };
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async school42Auth(@Req() req) {}

  @Get('42/redirect')
  @UseGuards(AuthGuard('42'))
  async school42AuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.addUser(req);

    const payload = { userId: data.user.id };
    const token = this.jwtService.sign(payload);
    console.log('TOKEN');
    response.cookie('access_token', token, {
      httpOnly: true,
    });
    return { data };
  }

  @Get('test')
  test(@Res({ passthrough: true }) res: Response) {
    const payload = { userId: 1 };
    const token = this.jwtService.sign(payload);
    console.log('TOKEN');
    res.cookie('access_token', token, {
      httpOnly: true,
    });
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
        domain: 'localhost',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .send({ success: true });
  }

  @Post('pseudo')
  @UseGuards(AuthGuard('jwt'))
  async uppdatePseudo(@Param('id') id: string, @Req() req) {
    await this.usersService.update(id, req.body.pseudo);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req): string {
    console.log();
    return req.user;
  }

  @Get('me/pseudo')
  @UseGuards(AuthGuard('jwt'))
  getPseudo(@Req() req): string {
    console.log(req.user.pseudo);
    return req.user.pseudo;
  }

  //DELETE randomUser method
  // @Get('randomUser')
  // async addRandomUser() {
  //   const data = await this.appService.createRandomUser();
  //   return { data };
  // }
}
